import { User } from "../../userM/user.model";
import { Router } from "@angular/router";
import { Answer } from "../answer/answer.model";

export class Question {
    private _id : String;
    private _poster : User;
    private _body : string;
    private _title : string;
    private _datePosted : Date;
    private _answers : Answer[];
    
    constructor(poster : User, body : string, title : string, date:Date) {
        this._poster = poster;
        this._body = body;
        this._title = title;
        this._datePosted=date;
        this._answers = new Array();
        console.log(body);
    }
    get id() : String {
        return this._id;
    }
    set id(id : String) {
        this._id = id;
    }
    get poster() : User {
        return this._poster;
    }

    get title() : string {
        return this._title;
    }

    get body() : string {
        return this._body;
    }
    set body(body : string)  {
        this._body = body;
    }
    get answers() : Answer[] {
        return this._answers;
    }
    get answerAmount() : number {
        return this._answers.length;
    }
    addAnswer(answer : Answer) {
        this._answers.push(answer);
    }
    static fromJSON(json: any): Question {
        const question = new Question(
          new User("Niemand", "Iemand"),
          json.body,
          json.title,
          json.date,

        );
    
        question._id = json._id;
        question._answers =   json.answers.map(Answer.fromJSON);

        return question;
      }
    
    toJSON() {
   
        return {
            _id: this._id,
            poster: this._poster.id,
            body: this._body,
            title: this._title,
            date: this._datePosted,
            answers: this._answers.map(i => i.toJSON())
        }
    }
}