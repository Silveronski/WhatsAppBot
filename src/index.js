const contactOperations = require('./contactOperations');
const { Client, LocalAuth } = require('whatsapp-web.js');
const readline = require('readline');
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

client.on('ready', () => {
    initializeContacts();
    promptUser();
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptUser = () => {
    rl.question('Enter a command (send/exit): ', (command) => {
        if (command === 'send') {
            sendMessageToContacts();
            rl.close();
        } 
        else if (command === 'exit') {
            console.log('Readline interface is closed.');
            rl.close(); 
        }
        else {
            console.log('Invalid command. Please try again.');
            promptUser(); 
        }
    });
}


client.on('message', msg => {
    if (contacts) {
        let currentContact = contacts.find(contact => contact.phoneNumber === msg.from
            && !contact.hasResponded && contact.hasReceivedMsg);
        let proceed = currentContact !== undefined;
        
        if (proceed){
            if (msg.body.trim() === "1" || msg.body.trim() === "0" || parseInt(msg.body) > 1){
                 if (parseInt(msg.body) >= 1) {
                    msg.reply(currentContact.contactComing()); 
                }
                else {
                    msg.reply(currentContact.contactNotComing());
                }              
                currentContact.hasResponded = true;
                currentContact.howManyComing = msg.body.trim();
                contactOperations.saveContactAttendanceInfo(currentContact, contacts);               
            }
            else {
                msg.reply(currentContact.invalidAnswerReceived());
            }
        }   
    }  
});


const initializeContacts = async () => {
    try {
        contacts = await contactOperations.readContactsFromFile();       
    }
    catch (err) {
        console.error('Error initializing contacts:', err);
    }    
}

const sendMessageToContacts = () => {
    contacts.forEach(contact => {
        try {
            client.sendMessage(contact.phoneNumber, contact.greeting());
            contact.hasReceivedMsg = true;
        }
        catch (err) {
            console.error('Error sending the messages to the contacts', err);
        }      
    });
    console.log('Messages have been succesfully sent.');
}

client.initialize();