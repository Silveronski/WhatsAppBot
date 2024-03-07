const contactOperations = require('./contactOperations');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// const readline = require('readline');
const qrcode = require('qrcode-terminal'); 
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
    sendMessageToContacts();
});

client.on('message', async msg => {
    if (contacts) {
        let currentContact = contacts.find(contact => contact.phoneNumber === msg.from
            && !contact.hasResponded && contact.hasReceivedMsg);
        let proceed = currentContact !== undefined;
              
        if (proceed && (msg.body.trim() === "1" || msg.body.trim() === "0" || parseInt(msg.body) > 1)){

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
            client.sendMessage(msg.from, currentContact.invalidAnswerReceived());
        }
          
    }  
});


const sendMessageToContacts = () => {
    const coupleImage = MessageMedia.fromFilePath('./assets/images/pazlior.jpg');
    contacts.forEach(contact => {
        try {
            client.sendMessage(contact.phoneNumber, coupleImage, {caption: contact.greeting()});
            contact.hasReceivedMsg = true;
        }
        catch (err) {
            console.error('Error sending the messages to the contacts', err);
        }      
    });
    console.log('Messages have been succesfully sent.');
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