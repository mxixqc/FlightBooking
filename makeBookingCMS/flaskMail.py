from distutils.log import error
from flask import Flask, jsonify, request
from flask_mail import Message, Mail
import os
import json
import amqp_setup

monitorBindingKey = "#"

# amqpSendMail() function to connect queue to flaskMail microservice.
def amqpSendMail():
    amqp_setup.check_setup()
    queue_name = 'Activity_Log'
    
    amqp_setup.channel.basic_consume(queue=queue_name, on_message_callback=sendMail, auto_ack=True)
    # set up consumer and start to wait for coming messages
    # sendMail is a callback function that invokes flask-mail 
    
    amqp_setup.channel.start_consuming() # an implicit loop waiting to receive messages; 
    #it doesn't exit by default. Use Ctrl+C in the command window to terminate it.


def sendMail(channel, method, properties, body):
    app = Flask(__name__)
    

    with app.app_context():
        app.config['MAIL_SERVER'] = 'smtp.gmail.com' 
        app.config['MAIL_PORT'] = 465
        app.config['MAIL_USE_TLS'] = False
        app.config['MAIL_USE_SSL'] = True
        # app.config['MAIL_DEBUG'] = app.debug
        app.config['MAIL_USERNAME'] = 'esd.t1.smu'
        app.config['MAIL_PASSWORD'] = 'P@ssw0rdesd'
        app.config['MAIL_DEFAULT_SENDER'] = None
        app.config['MAIL_MAX_EMAILS'] = None
        # app.config['MAIL_SUPPRESS_SEND'] = app.testing
        app.config['MAIL_ASCII_ATTACHMENTS'] = False
        mail = Mail(app)

        # json.loads(body) converts body JSON data from CMS to python dictionary 
        bookingDetails = json.loads(body)
        print('bookingDetails: ', bookingDetails)
        print('bookingDetails type: ', type(bookingDetails))
        
        # get email address from bookingDetails
        email_address = bookingDetails["bookingDetails"]["payer"]["email"]
        
        msg = Message("Test Message", sender='esd.t1.smu@gmail.com', recipients=[email_address])
        
        # add booking details to message_contents to send via email
        message_contents = ""
        for key in bookingDetails["bookingDetails"]:
            message_contents += key + ": \n"
            for nkey in bookingDetails["bookingDetails"][key]:
                message_contents += nkey + ": " + str(bookingDetails["bookingDetails"][key][nkey]) + "\n"
        msg.body = "Your Flight Details are the following: \n" + message_contents
        print(msg.body)

        try:
            print("\n sending message now...")
            # send email to recipient
            mail.send(msg)
            print("Successfully sent email using flask-mail via AMQP")
        except Exception as e:
            return jsonify(
                {
                    "code": 500,
                    "message": "An error occurred while trying to send the email" + str(e)
                }
            ), 500
        
        # return jsonify(
        #     {
        #         "code": 200,
        #         "message": "Email has been sent successfully"
        #     }
        # )

if __name__ == '__main__':
    print("This is " + os.path.basename(__file__), end="")
    print(": monitoring routing key '{}' in exchange '{}'...".format(monitorBindingKey, amqp_setup.exchangename))
    amqpSendMail()




