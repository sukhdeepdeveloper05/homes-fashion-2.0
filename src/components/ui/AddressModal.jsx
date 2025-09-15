"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import { Separator } from "@/components/shadcn/separator";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/fields/Input";
import LocationSearch from "@/components/ui/fields/LocationSearch";
import useOlaMap from "@/hooks/location/olaMap";
import { useCreateMutation, useUpdateMutation } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef } from "react";
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

export default function AddressModal({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex md:min-h-[540px] w-[calc(100%-40px)] md:!max-w-[1000px] p-0 overflow-hidden"
        overlayClassName="overlay"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <MainContent
          defaultCoordinates={{
            lat: initialData?.coordinates?.lat || 30.67925024285887,
            lng: initialData?.coordinates?.lng || 76.70350083846176,
          }}
          initialData={initialData}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

function MainContent({ defaultCoordinates, initialData, onSuccess }) {
  const defaultValues = {
    label: initialData?.label || "Home",
    name: initialData?.name || "",
    houseNumber: initialData?.houseNumber || "",
    landmark: initialData?.landmark || "",
    placeId: initialData?.placeId || "",
    formattedAddress: initialData?.formattedAddress || "",
    zipCode: initialData?.zipCode || "",
    state: initialData?.state || "",
    city: initialData?.city || "",
    street: initialData?.street || "",
    coordinates: initialData?.coordinates || defaultCoordinates,
  };

  const mapContainerRef = useRef(null);

  const onLocationChange = useCallback(async (place) => {
    if (!place) return;

    const rooftopPlace = place?.result
      ? place.result
      : place?.results &&
        place.results.length > 0 &&
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

    form.reset({
      ...form.getValues(),
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
    });
  }, []);

  const { moveMarkerTo, geolocate } = useOlaMap({
    mapContainerRef,
    onLocationChange,
    defaultCoordinates,
  });

  const { mutateAsync: createAddress } = useCreateMutation({
    handle: "address",
    url: "/addresses",
  });

  const { mutateAsync: updateAddress } = useUpdateMutation({
    handle: "address",
    url: "/addresses",
  });

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      if (initialData?.id) {
        const response = await updateAddress({
          id: initialData.id,
          values: data,
        });
        console.log("update address", response.data);
        await onSuccess(response.data);
      } else {
        const response = await createAddress({ values: data });
        console.log("create address", response.data);
        await onSuccess(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <DialogTitle className="hidden">Select address</DialogTitle>
      {/* Map container */}
      <div className="md:grid grid-cols-[1fr_1fr] w-full overflow-auto">
        <div className="w-full aspect-square h-auto relative">
          <div className="w-full h-full relative" ref={mapContainerRef} />
        </div>

        <div className="p-4 py-6 flex flex-col">
          <LocationSearch
            moveMarkerTo={moveMarkerTo}
            onLocationChange={onLocationChange}
          />
          <div>
            <button
              className="text-sm text-blue-500 mt-2"
              onClick={() => {
                geolocate();
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
              className="text-sm font-semibold mt-5"
              onClick={() => {
                console.log(form.formState.errors);
                form.handleSubmit(onSubmit)();
              }}
              isLoading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              {initialData?.id ? "Update Address" : "Save Address"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
