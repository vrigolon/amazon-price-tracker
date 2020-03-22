require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const nightmare = require('nightmare')()

const args = process.argv.slice(2)
const url = args[0]
const myPrice = args[1]

checkPrice()


async function checkPrice() {
  const priceString = await nightmare.goto(url)
                                    .wait("#priceblock_ourprice")
                                    .evaluate(() => 
                                    document.getElementById
                                    ("priceblock_ourprice")
                                    .innerText)
                                    .end()
                                    

  const priceNumber = parseFloat(priceString.replace(',', '.'))
  const minPrice = parseFloat(myPrice.replace(',', '.'))
  if(priceNumber <= minPrice) {
    console.log(`The price is ${priceString} now: It is cheap!!`)
    sendEmail('Price is low', `The price on ${url} has dropped below ${minPrice}€`)
  } else {
    console.log(`The price is ${priceString} now: It is expensive!!`)
  }


}

function sendEmail(subject, body) {
  const email = {
    to: 'you-email-here@mail.com',
    from: 'amazon-price-checker@checkpriceamz.com',
    subject: subject,
    text: body,
    html: body
  }
  return (
    sgMail.send(email) &&
    console.log(`Sended email to ${email.to}`)
  )
}