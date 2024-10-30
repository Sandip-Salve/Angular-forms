import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserDTO } from './DTOs/userDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-II';
  userDTO:UserDTO = new UserDTO();
  districtList:string[] = ['Satara','Pune','Mumbai'];
  skillSet:any[] = [
    {
      id:1,
      name:'java',
      isSelected:false
    },
    {
      id:2,
      name:'.net',
      isSelected:false
    }
  ];
  savedUserList:UserDTO[] = [];
  isFormSubmitted!:boolean;
  isPuneRegionSelected!:boolean;

  constructor(){

  }

  ngOnInit(){

  }

  onSubmit(regiForm:NgForm){
    this.isFormSubmitted = true;
    if(regiForm.valid){
      const userToSave = regiForm.value as UserDTO;
      userToSave.skills = this.getSelectedSkills();
      const isUserReadyToUpdate:boolean = this.isUserToUpdate(userToSave);
      if(isUserReadyToUpdate){
        const index = this.savedUserList.findIndex(user=>user.name===userToSave.name);
        if(index>-1){
          this.savedUserList[index] = userToSave;
          alert('Updated successfully.');
        }
      }else{
        this.savedUserList.push(userToSave);
        alert('Saved successfully.');
      }
      regiForm.reset();
      this.isFormSubmitted = false;
    }
  }

  isUserToUpdate(userToUpdate:UserDTO){
    const index = this.savedUserList.findIndex(user=>user.name===userToUpdate.name);
    return index>-1 ? true : false;
  }

  getSelectedSkills():string[]{
    return this.skillSet.filter(skill=>skill.isSelected).map(skill=>skill.name);
  }

  onUpdate(user:UserDTO){
    this.userDTO = user;
    this.updateSkills(user);
  }

  updateSkills(user:UserDTO){
    if(user.skills){
      this.skillSet.map(skill=>user.skills.includes(skill.name)?(skill.isSelected=true):skill);
    }
  }

  onDelete(userToDelete:UserDTO){
    const index = this.savedUserList.findIndex(user=>user.name===userToDelete.name);
    if(index>-1){
      this.savedUserList.splice(index,1);
    }
  }

  checkForPuneRegion(selectedDistrict:string){
    this.isPuneRegionSelected = selectedDistrict!=='Pune';
  }
}
