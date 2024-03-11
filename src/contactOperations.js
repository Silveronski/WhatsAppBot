const ContactPerson = require('./ContactPerson');
const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');
const contactsFilePath = path.join(__dirname, '../data/contacts.csv');

const readContactsFromFile = async () => {   
    try {
        const contactsData = await fs.promises.readFile(contactsFilePath);
        const dataDecoded = iconv.decode(contactsData, 'windows-1255');        
        
        const contacts = dataDecoded.split('\n')
        .filter(line => line.trim() !== '')
        .map(row => {
            const [name, phoneNumber] = row.split(',');
            return new ContactPerson(name, phoneNumber);
        }); 

        console.log("Contacts from contacts.csv:", contacts);
        return contacts;
    }
    catch (err) {
        console.error('Error reading contacts from CSV:', err);   
    }          
}

const saveContactAttendanceInfo = async (contact, contacts) => {
    try {
        if (contact && contacts) {
            const attendanceData = contacts.map(c => `"${c.name.trim()}",${c.phoneNumber.substring(0,12)},${c.howManyComing}`).join('\n');
            const encodedData = iconv.encode(attendanceData, 'windows-1255');
            await fs.promises.writeFile(contactsFilePath, encodedData);
            console.log('Contact info saved successfully.', contact);
        }
        else {
            console.error('Contact not found.');
        }
    }
    catch (err) {
        throw err;
    }  
}

module.exports = { readContactsFromFile, saveContactAttendanceInfo };