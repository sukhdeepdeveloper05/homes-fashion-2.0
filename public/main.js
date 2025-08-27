document.getElementById("payBtn").onclick = function () {
  // Get the order_id entered by the user
  const orderId = document.getElementById("order_id").value;

  // If no order_id is entered, alert the user
  if (!orderId) {
    alert("Please enter a valid Order ID");
    return;
  }

  const options = {
    key: "rzp_test_GKhHkCLlohURK6", // Your Razorpay Key ID (replace with your key)
    order_id: orderId, // Use the manually entered order ID
    handler: function (response) {
      alert(response.razorpay_payment_id);
      alert(response.razorpay_order_id);
      alert(response.razorpay_signature);
    },
    prefill: {
      name: "Customer Name", // Prefill name of the customer
      email: "customer@example.com", // Prefill email of the customer
      contact: "+919876543210", // Prefill contact number
    },

    notes: {
      address: "Customer Address", // Optional notes (e.g., delivery address)
    },

    theme: {
      color: "#F37254", // Customize the color of the Razorpay payment modal
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
};
