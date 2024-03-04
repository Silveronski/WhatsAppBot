class ContactPerson{
    constructor(name, phoneNumber){
        this.name = name.trim().replace(/^"(.*)"$/, '$1');
        this.phoneNumber = phoneNumber.trim() + "@c.us";
        this.hasResponded = false;
        this.hasReceivedMsg = false;
        this.howManyComing = -1;
    }

    greeting() {
        return "שלום " + this.name.trim() + ".\n"+
               "מגיע/ה לבד? השיבו \"1\".\n" +
               "מגיעים יותר? השיבו עם מספר המגיעים המדויק.\n" +
               "לא מגיעים? השיבו \"0\".";
    }
    
    invalidAnswerReceived(){
        return "אנא השיבו להודעה זו עם מספר.";
    }
}

module.exports = ContactPerson;