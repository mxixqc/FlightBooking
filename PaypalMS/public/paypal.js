//Declare variable here
paypal.Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: function() {
      return fetch('/create-order' ,
      {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          items: [{
            id: 1,
            quantity: 2
          },
        { id:2,
        quantity: 3},],
        })

      }).then(res => {
        if(res.ok) return res.json()
        //rejects if it's a failure
        return res.json().then(json => Promise.reject(json))
      }).then(({ id }) => {
        //return id if it's successful
        return id
      }).catch(e => {
        console.error(e.error)
      })
    },

    // Finalize the transaction after payer approval
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(orderData) {
        // Successful capture! For dev/demo purposes:
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            var transaction = orderData.purchase_units[0].payments.captures[0];
            alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');

        // When ready to go live, remove the alert and show a success message within this page. For example:
        // var element = document.getElementById('paypal-button-container');
        // element.innerHTML = '';
        // element.innerHTML = '<h3>Thank you for your payment!</h3>';
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
    }
  }).render('#paypal');