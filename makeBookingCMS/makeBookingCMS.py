from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
import amqp_setup
import json

import requests
from invokes import invoke_http

# import amqp_setup
# import pika
# import json

app = Flask(__name__)
CORS(app)


flask_mail_URL = "http://localhost:5001/sendMail"
# book_URL = "http://localhost:5000/book"
# order_URL = "http://localhost:5001/order"
# shipping_record_URL = "http://localhost:5002/shipping_record"
# activity_log_URL = "http://localhost:5003/activity_log"
# error_URL = "http://localhost:5004/error"


@app.route("/notification", methods=['POST'])
def makeBooking():
    if request.is_json:
        try:
            # convert JSON to dictionary
            inputBookingDetails = request.get_json()
            print("\n booking details received in JSON:", inputBookingDetails)
            print("\n type of booking details:", type(inputBookingDetails))
            
            # invoke bookingMS using http_invoke to store booking data in the DB
            bookingStatus = sendBookingDetails(inputBookingDetails).get_json()[0]
            # print('bookingStatus type: ', type(bookingStatus))
            
            
            if(bookingStatus in range(200, 300)):
                # call sendNotification() function that will invoke flaskMail microservice via AMQP
                print('\n\n-----Publishing the (order info) message with routing_key=order.info-----')
                # inputBookingDetails['bookingDetails'].pop('token')
                sendNotification(inputBookingDetails)
                print('\n------------------------')
                return jsonify(
                    {
                        "code": 200,
                        "message": "Successfully sent inputs: " + str(request.get_data())
                    }
                ), 200
            
            
        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "makeBookingCMS.py internal error: " + ex_str
            }), 500
    # if the input is not a JSON object
    return jsonify(
        {
            "code": 400,
            "message": "Invalid JSON input: " + str(request.get_data())
        }
    ), 400

def sendNotification(bookingDetails):
    print("\n invoking flaskMail microservice")
    try:
        print("BookingDetails: ", bookingDetails)
        print("BookingDetails type : ", type(json.dumps(bookingDetails)))
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.info", body=json.dumps(bookingDetails))
        return jsonify(
                {
                    "code": 200,
                    "message": "AMQP successfully published: " + str(request.get_data())
                }
            ), 200
        
    except Exception as e:
        return jsonify(
        {
            "code": 400,
            "message": "Invalid JSON input: " + str(request.get_data())
        }
    ), 400


# function to send data to the bookingMS
def sendBookingDetails(bookingDetails):
    # bookingDetails is passed in as a dictionary
    # extract token from bookingDetails JSON

    userToken = bookingDetails['bookingDetails'].pop("token")

    # URL for bookingMS
    bookingMSURL = "http://localhost:5000/api/bookings"
    # maintain the double quotations marks
    print("bookingDetails: ", type(bookingDetails))

    """
    structure of data being sent to bookingMS:
    bookingDetails = {
        {
            "passenger":{
                "fname":"passFirstName",
                "lname":"passLastName",
                "dob":"passDOB"
            },
            "payer":{
                "salutation": "payerSalutation",
                "fname":"payerFirstName",
                "lname":"payerLastName",
                "email":"payerEmail"
            },
            "flightDetails":{
                "airlineID":"airlineID",
                "destAP": "destAP",
                "sourceAP":"sourceAP",
                "flightDate":"flightDate",
                "totalPrice": "newTotalPrice"
                }
        }
    }
    """
    print('\n--------sendBookingDetails() invoking BookingMS using invoke_ http-----------')

    orderBookingStatus = invoke_http(bookingMSURL, userToken, method='POST', json=bookingDetails)

    return jsonify(orderBookingStatus)


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for placing an order...")
    app.run(host="0.0.0.0", port=5100, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.

