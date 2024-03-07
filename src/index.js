const contactOperations = require('./contactOperations');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// const readline = require('readline');
const qrcode = require('qrcode-terminal'); 
const coupleImage = MessageMedia.fromFilePath('./assets/images/pazlior.jpg');
let currentTime;
let contacts;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsAppSession'
    })
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {  
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    contacts = await contactOperations.readContactsFromFile();
    await sendMessageToContacts();
    currentTime = parseInt(Date.now().toLocaleString().substring(0,13).replace(/,/g,""));
});

client.on('message', async msg => {
    if (contacts && parseMsgDateToNumber(msg.timestamp) > currentTime) {       
        let currentContact = contacts.find(contact => contact.phoneNumber === msg.from
            && !contact.hasResponded && contact.hasReceivedMsg);
        let proceed = currentContact !== undefined;
      
        if (proceed && (msg.body.trim() === "1" || msg.body.trim() === "0" || parseInt(msg.body) > 1)) {

            if (parseInt(msg.body) >= 1) {
                msg.reply(currentContact.contactComing()); 
            }
            else {
                msg.reply(currentContact.contactNotComing());
            }   
                        
            currentContact.hasResponded = true;
            currentContact.howManyComing = msg.body.trim();     
            await contactOperations.saveContactAttendanceInfo(currentContact, contacts)
                .catch(error => {
                    console.error('Error saving contact attendance info:', error);
                    currentContact.hasResponded = false;
                    client.sendMessage(currentContact.phoneNumber, currentContact.errorInResponse());
                });         
        }               
        else {
            if (currentContact) {
                await client.sendMessage(msg.from, currentContact.invalidAnswerReceived());
            }
        }         
    }  
});


const sendMessageToContacts = async () => {
    try {
        const results = await Promise.all(contacts.map(async (contact) => {
            try {
                await client.sendMessage(contact.phoneNumber, coupleImage, { caption: contact.greeting() });
                contact.hasReceivedMsg = true;
                return true; 
            } 
            catch (err) {
                console.error('Error sending message to contact:', contact, err);
                return false; 
            }
        }));

        if (results.every(result => result)) {
            console.log('Messages have been successfully sent.');
        } 
        else {
            console.log('Some messages failed to send.');
        }
    } 
    catch (error) {
        console.error('Error sending messages to contacts:', error);
    }
};

const parseMsgDateToNumber = (msgDate) => {
    return parseInt(msgDate.toLocaleString().replace(/,/g,""));
}

client.initialize();







// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// const promptUser = () => {
//     rl.question('Enter a command (send/exit): ', (command) => {
//         if (command === 'send') {
//             sendMessageToContacts();
//             rl.close();
//         } 
//         else if (command === 'exit') {
//             console.log('Readline interface is closed.');
//             rl.close(); 
//             process.exit();
//         }
//         else {
//             console.log('Invalid command. Please try again.');
//             promptUser(); 
//         }
//     });
// }