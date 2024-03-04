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
               "הנכם מוזמנים לחתונה של פז חכם וליאור זילבר ב- 17/09/2024 בשעה 19:30 באולמי טרה, קיסריה.\n\n"+
               "אנא אשרו הגעתכם והשיבו עם מספר המגיעים בלבד כמפורט:\n"+
               "מגיע/ה לבד? השיבו \"1\".\n" +
               "מגיעים יותר? השיבו עם מספר המגיעים המדויק.\n" +
               "לא מגיעים? השיבו \"0\".";
    }
    
    invalidAnswerReceived(){
        return "אנא השיבו להודעה זו עם מספר המגיעים המדויק.\n" +
               "במידה ואתם לא מגיעים, השיבו \"0\".";
    }

    contactComing(){
        return "איזה כיף שאתם באים, תודה על המענה!"
               
    }

    contactNotComing(){
        return "אוף, איזה באסה, תודה על המענה!";
    }
}

module.exports = ContactPerson;