"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import { Separator } from "@/components/shadcn/separator";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/fields/Input";
import LocationSearch from "@/components/ui/fields/LocationSearch";
import useOlaMap from "@/hooks/location/olaMap";
import { useCreateMutation } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const addressSchema = z.object({
  label: z.string().nonempty({ error: "Label is required" }),
  name: z.string().nonempty({ error: "Name is required" }),
  houseNumber: z.string().nonempty({ error: "House number is required" }),
  landmark: z.string().optional(),
  placeId: z.string().nonempty(),
  formattedAddress: z.string().nonempty(),
  zipCode: z.string().nonempty({ error: "zip code is required" }),
  state: z.string().nonempty({ error: "state is required" }),
  city: z.string().nonempty({ error: "city is required" }),
  street: z.string().nonempty({ error: "street is required" }),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

const defaultValues = {
  label: "Home",
  name: "",
  houseNumber: "",
  landmark: "",
  coordinates: null,
  placeId: "",
  formattedAddress: "",
  zipCode: "",
  state: "",
  city: "",
  street: "",
};

export default function SelectAddressModal({ open, onOpenChange, onSuccess }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex min-w-[950px] min-h-[650px] p-0 overflow-hidden"
        overlayClassName="overlay"
        showCloseButton={false}
      >
        <MainContent
          onSuccess={onSuccess}
          defaultCoordinates={{
            lat: 30.67925024285887,
            lng: 76.70350083846176,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function MainContent({ defaultCoordinates, onSuccess }) {
  const mapContainerRef = useRef(null);

  const onLocationChange = async (place) => {
    console.log(place);

    const rooftopPlace = place?.result
      ? place.result
      : place?.results &&
        place.results[0].geometry.location_type !== "range_interpolated"
      ? place.results[0]
      : place.results.find((p) => p.geometry.location_type === "rooftop") ||
        place.results[1] ||
        null;
    if (!rooftopPlace) return;
    // Extract address components
    const components = rooftopPlace.address_components || [];

    const getComponent = (type) =>
      components.find((c) => c.types.includes(type))?.long_name || "";

    form.reset(
      {
        ...form.getValues(), // keep existing values (label, houseNumber, landmark)
        name: rooftopPlace.name,
        placeId: rooftopPlace.place_id,
        formattedAddress: rooftopPlace.formatted_address || "",
        zipCode: getComponent("postal_code"),
        state: getComponent("administrative_area_level_1"),
        city: getComponent("locality") || getComponent("sublocality"),
        street:
          getComponent("administrative_area_level_3") ||
          getComponent("administrative_area_level_2"),
        coordinates: {
          lat: rooftopPlace.geometry.location.lat,
          lng: rooftopPlace.geometry.location.lng,
        },
      }
      // { keepDefaultValues: true } // prevents wiping untouched fields
    );
  };

  const { moveMarkerTo, geolocateRef } = useOlaMap({
    mapContainerRef,
    onLocationChange,
    defaultCoordinates,
  });

  const { mutateAsync: createAddress } = useCreateMutation({
    handle: "address",
    url: "/addresses",
  });

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      const response = await createAddress({ values: data });
      console.log("create address", response.data);
      await onSuccess(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(form.watch("name"));

  return (
    <>
      <DialogTitle className="hidden">Select address</DialogTitle>
      {/* Map container */}
      <div className="grid grid-cols-12 w-full">
        <div className="w-full h-full col-span-7 relative">
          <div className="w-full h-full relative" ref={mapContainerRef} />
        </div>

        <div className="col-span-5 p-4 py-6 flex flex-col">
          <LocationSearch
            moveMarkerTo={moveMarkerTo}
            onLocationChange={onLocationChange}
          />
          <div>
            <button
              className="text-sm text-blue-500 mt-2"
              onClick={() => {
                geolocateRef.current.trigger();
              }}
            >
              Use current location
            </button>
          </div>

          <div className="my-6">
            <h3 className="text-xl font-semibold">{form.watch("name")}</h3>
            <p className="text-sm text-foreground-secondary line-clamp-2">
              {form.watch("formattedAddress")}
            </p>
          </div>
          <Separator />
          <div className="mt-4 flex flex-col justify-between h-full">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <Input
                  name="houseNumber"
                  control={form.control}
                  type="text"
                  placeholder="House/Flat Number*"
                  className="w-full border p-3 rounded-md text-sm"
                />
                <Input
                  name="landmark"
                  control={form.control}
                  type="text"
                  placeholder="Landmark (optional)"
                  className="w-full border p-3 rounded-md text-sm"
                />
                <Input
                  name="label"
                  label="Save as"
                  control={form.control}
                  type="text"
                  placeholder="Eg. John’s home, Mom’s place, etc."
                  className="w-full border p-3 rounded-md text-sm"
                />
              </form>
            </Form>
            <Button
              className="text-sm font-semibold"
              onClick={() => {
                console.log(form.formState.errors);
                form.handleSubmit(onSubmit)();
              }}
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              Save and Proceed to Slots
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
