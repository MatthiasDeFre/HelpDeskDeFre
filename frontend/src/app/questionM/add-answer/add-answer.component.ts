import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../question.service';
import { Router } from '@angular/router';
import { Answer } from '../answer/answer.model';
import { Question } from '../question/question.model';

@Component({
  selector: 'app-add-answer',
  templateUrl: './add-answer.component.html',
  styleUrls: ['./add-answer.component.css']
})
export class AddAnswerComponent implements OnInit {
  

  @Input() public question : Question;
  private answer : FormGroup
  
  constructor(private fb : FormBuilder, private questionService : QuestionService, private router : Router) { }

  ngOnInit() {
    this.answer = this.createFormGroup(); 
  }
  onSubmit() {
    console.log("submit");
    let body = this.answer.value.body
    /*body = body.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
    body = body.replace(new RegExp("<script>", 'g'), "<^script^>");
    body = body.replace(new RegExp("</script>", 'g'), "<^/script^>");*/
    const answer = new Answer(body);
    console.log(this.answer.value.body);
    this.questionService.addAnswerToQuestion(this.question.id, answer).subscribe(
      (item) => this.question.addAnswer(item),
      () => {},
      () =>  {
       this.answer = this.createFormGroup();
      });
    
    /*this.questionService.addNewQuestion(question).subscribe(
      (item) => this.answer.id = item.id,
    () => {},
  ()=>  this.router.navigate(["/question", question.id]));*/
  }

  get id() {
    return this.question.id;
  }

  createFormGroup() : FormGroup {
    return this.fb.group({
      body: ["",[Validators.required, Validators.minLength(10)]]
    });
  }
}
