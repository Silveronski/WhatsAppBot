class ContactPerson{
    constructor(name, phoneNumber){
        this.name = name.trim().replace(/^"(.*)"$/, '$1');
        this.phoneNumber = phoneNumber.trim() + "@c.us";
        this.hasResponded = false;
        this.hasReceivedMsg = false;
        this.howManyComing = -1;
    }

    greeting() {
        return "שלום " + this.name.trim() + ".\n\n"+
               "הנכם מוזמנים לחתונה של ליאור זילבר ופז חכם 💍\n"+
               "החתונה תתקיים בתאריך- 17/09/2024 יום שלישי בשעה 19:30 בגן האירועים טרה, קיסריה.\n\n"+
               "אנא אשרו הגעתכם והשיבו עם מספר המגיעים כמפורט:\n"+
               "מגיע/ה לבד? השיבו \"1\".\n" +
               "מגיעים יותר? השיבו עם מספר המגיעים המדויק.\n" +
               "לא מגיעים? השיבו \"0\".";
    }
    
    invalidAnswerReceived() {
        return "אנא השיבו להודעה זו עם מספר המגיעים המדויק.\n" +
               "במידה ואתם לא מגיעים, השיבו \"0\".";
    }

    contactComing() {
        return "איזה כיף שאתם באים 🥰, נתראה!";              
    }

    contactNotComing() {
        return "אוף, איזה באסה, תודה על המענה!";
    }

    errorInResponse() {
        return "נתקלנו בבעיה בעיבוד ההודעה.\n"+
                "אנא נסו שנית.";
    }

    reminder() {
        return "שלום " + this.name.trim() + ",\n"+
                "מחכים לראות אתכם היום בחתונה של פז וליאור ♥\n"+
                "גן האירועים טרה, החרש 19, קיסריה.\n"+
                "קבלת פנים בשעה 19:30.\n"+
                "לניווט: https://tinyurl.com/2wr2bfre"
    }

    thankYou() {
        return "";
    }
}

module.exports = ContactPerson;