const weddingInfo = require('../data/weddingInfo.json');

class ContactPerson{
    constructor(name, phoneNumber, howManyComing){
        this.name = name.trim().replace(/^"(.*)"$/, '$1');
        this.phoneNumber = phoneNumber.trim() + "@c.us";
        this.howManyComing = howManyComing;
        this.hasResponded = false;
        this.hasReceivedMsg = false;        
    }

    greeting() {
        return "שלום " + this.name.trim() + ",\n\n"+
               `הנכם מוזמנים לחתונה של ${weddingInfo.bride} ו${weddingInfo.groom} 💍\n`+
               `החתונה תתקיים בתאריך- ${weddingInfo.date} בשעה ${weddingInfo.reception_hour} ב${weddingInfo.venue}.\n\n`+
               "אנא אשרו הגעתכם והשיבו עם מספר המגיעים כמפורט:\n"+
               "מגיע/ה לבד? השיבו \"1\".\n" +
               "מגיעים יותר? השיבו עם מספר המגיעים המדויק.\n" +
               "לא מגיעים? השיבו \"0\".";
    }

    static contactComing() {
        return "איזה כיף שאתם באים 🥰 נתראה!";              
    }

    static contactNotComing() {
        return "אוף, איזה באסה, תודה על המענה!";
    }

    static invalidAnswerReceived() {
        return "אנא השיבו להודעה זו עם מספר המגיעים המדויק.\n" +
               "במידה ואתם לא מגיעים, השיבו \"0\".";
    }

    static errorInResponse() {
        return "נתקלנו בבעיה בעיבוד ההודעה.\n"+
                "אנא נסו שנית.";
    }

    reminder() {
        return "שלום " + this.name.trim() + ",\n"+
                `מחכים לראות אתכם היום בחתונה של ${weddingInfo.bride} ו${weddingInfo.groom} ♥\n`+
                `${weddingInfo.detailed_venue}.\n`+
                `קבלת פנים בשעה ${weddingInfo.reception_hour}.\n`+
                `לניווט: ${weddingInfo.waze_nav_url}`
    }

    thankYou() {
        return "תודה שהגעתם!";
    }
}

module.exports = ContactPerson;