from logging import debug
from flask import Flask, render_template, jsonify,request  

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('button.html')

@app.route('/payment', methods=['GET'])
def payment():
    return "Success!"
    # return jsonify({'paymentID' : ''})


if __name__ == '__main__':
    app.run(debug=True)