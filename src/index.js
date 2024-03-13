const contactOperations = require('./contactOperations');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal'); 
const ContactPerson = require('./ContactPerson');
const readline = require('readline');
const coupleImage = MessageMedia.fromFilePath('./assets/images/pazlior.jpg');
let timeOfAppStartup;
let contacts;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsAppSession'
    }),
    webVersion: '2.2410.1',
    webVersionCache: {type: 'local'}
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptUser = () => {
    rl.question('Enter a command (greeting/reminder/thanks/exit): ', async (command) => {
        switch (command) { 
                              
            case 'greeting':                         
                await sendMessageToContacts();
                rl.close(); 
                break;
                               
            case 'reminder':
                //
                rl.close(); 
                break;

            case 'thanks':
                //
                rl.close(); 
                break;

            case 'exit':
                console.log('Readline interface is now closed.');
                rl.close(); 
                process.exit();

            default:
                console.log('Invalid command. Please try again.');
                promptUser();
        }              
    });
}

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
    timeOfAppStartup = parseInt(Date.now().toLocaleString().substring(0,13).replace(/,/g,""));
    contacts = await contactOperations.readContactsFromFile();
    promptUser();
});

client.on('message', async msg => {
    if (contacts && parseMsgDateToNumber(msg.timestamp) > timeOfAppStartup) { 

        let currentContact = contacts.find(contact => contact.phoneNumber === msg.from
            && !contact.hasResponded && contact.hasReceivedMsg);
        let proceed = currentContact !== undefined;
      
        if (proceed && hasOnlyNumericCharacters(msg.body)) {
            let contactInfoSaved = true;
            currentContact.hasResponded = true;
            currentContact.howManyComing = msg.body.trim();
            try {
                await contactOperations.saveContactAttendanceInfo(currentContact, contacts)
            }
            catch (error) {
                contactInfoSaved = false;
                currentContact.hasResponded = false;
                currentContact.howManyComing = -1;
                console.error('Error saving contact attendance info:', error);
                console.log("contact not saved:", currentContact);
                await client.sendMessage(currentContact.phoneNumber, ContactPerson.errorInResponse());
            }     
                             
            if (contactInfoSaved) {
                if (parseInt(msg.body) >= 1) {
                    await client.sendMessage(currentContact.phoneNumber, ContactPerson.contactComing());                   
                }
                else {
                    await client.sendMessage(currentContact.phoneNumber, ContactPerson.contactNotComing());
                }                                          
            }   
        }               
        else {
            if (currentContact) {
                await client.sendMessage(currentContact.phoneNumber, ContactPerson.invalidAnswerReceived());
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

const hasOnlyNumericCharacters = (msgInput) => {
    return msgInput.trim() !== '' && !/\D/.test(msgInput);
}

client.initialize();