require('dotenv').config()

const express = require("express")

const app = express()
//specify enginer to use express js
app.set("view engine", "ejs")
//set public folder
app.use(express.static("public"))
//read incoming json data
app.use(express.json())

const paypal = require('@paypal/checkout-server-sdk')
const Environment = process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment

const paypalClient = new paypal.core.PayPalHttpClient(new Environment
    (process.env.PAYPAL_CLIENT_ID,
     process.env.PAYPAL_CLIENT_SECRET 
))
const storeItems = new Map([
    [1, { price: 10, name: "Learn React Today"}],
    [2, { price: 20, name: "Learn CSS Today"}],
])
//Dynamically set clientID
app.get('/', (req, res) => {res.render("index", {paypalClientId: process.env.PAYPAL_CLIENT_ID })})

app.post('/create-order', async (req,res) => {
    const request = new paypal.orders.OrdersCreateRequest()
    const total = req.body.items.reduce((sum, item) => {
        return sum + storeItems.get(item.id).price * item.quantity
    },0)
    request.prefer("return=representation")
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "SGD",
                    value: total,
                    breakdown: {
                        item_total: {
                        currency_code: "SGD",
                        value: total
                        }
                    }
                },
                items: req.body.items.map(item => {
                    const storeItem = storeItems.get(item.id)
                    return {
                        name: storeItems.name,
                        unit_amount: {
                            currency_code: "SGD",
                            value: storeItem.price
                        },
                        quantity: item.quantity
                    }
                })
            }
        ]
    })

    try {
        const order = await paypalClient.execute(request)
        console.log(order)
        res.json({ id: order.result.id})
    }
    catch (e)
    {
        res.status(500).json({ error: e.message})
    }
})
app.listen(3000, ()=>{
    console.log('oi listening');
})