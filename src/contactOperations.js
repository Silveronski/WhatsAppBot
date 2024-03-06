const ContactPerson = require('./ContactPerson');
const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');
const contactsFilePath = path.join(__dirname, '../data/contacts.csv');

const readContactsFromFile = () => {
    return new Promise((resolve, reject) => {
        try {
            const buffer = fs.readFileSync(contactsFilePath);
            const data = iconv.decode(buffer, 'windows-1255');
            
            const contacts = data.split('\n')
                .filter(line => line.trim() !== '')
                .map(row => {
                    const [name, phoneNumber] = row.split(',');
                    return new ContactPerson(name, phoneNumber);
                });

            console.log("Contacts from contacts.csv:", contacts);
            resolve(contacts);
        }
        catch (err) {
            console.error('Error reading contacts from CSV:', err);
            reject(err);
        }       
    });
}

const saveContactAttendanceInfo = (contact, contacts) => {

    console.log('contact to be saved: ', contact);

    if (contact) {
        const attendanceData = contacts.map(c => `"${c.name.trim()}",${c.phoneNumber.substring(0,12)},${c.howManyComing}`).join('\n');
        const encodedData = iconv.encode(attendanceData, 'windows-1255');
        fs.writeFileSync(contactsFilePath, encodedData);
    }
    else {
        console.error('Contact not saved.');
    }
}

module.exports = { readContactsFromFile, saveContactAttendanceInfo };