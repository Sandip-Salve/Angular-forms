import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { UserDTO } from './DTOs/userDTO';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-I';
  regiForm!:FormGroup;
  userDTO:UserDTO = new UserDTO();
  isFormSubmitted!:boolean;
  districtList:string[] = ['Pune','Satara','Sangli','Mumbai'];
  skillSet:string[] = ['java','.net','html','angular','react'];
  savedUserList:UserDTO[] = [];
  currentPage:number = 1;

  constructor(private fb:FormBuilder){
    this.loadFormData();
  }

  loadFormData(){
    this.regiForm = this.fb.group({
      name : [this.userDTO.name,[Validators.required,Validators.pattern('^[A-Za-z]+(\\s[A-Za-z]+)*$')]],
      mobileNumber: [this.userDTO.mobileNumber,[Validators.required,Validators.pattern('^[7-9]{1}[0-9]{9}$')]],
      birthDate: [this.userDTO.birthDate,Validators.required],
      gender: [this.userDTO.gender,Validators.required],
      district: [this.userDTO.district,[Validators.required,this.checkForPuneDistrict()]],
      skills: this.fb.array([]),
    });
  }

  ngOnInit(){
    this.initializeSkills();
  }

  initializeSkills(){
    const skillsFormArray = this.skills;
    this.skillSet.forEach(()=>{
      skillsFormArray.push(this.fb.control(false));
    });
  }

  get skills():FormArray{
    return this.regiForm.controls['skills'] as FormArray;
  }

  onSubmit(){
    this.isFormSubmitted = true;
    if(this.regiForm.valid){
      const userToSave = this.regiForm.value as UserDTO;
      userToSave.skills = this.skills.value.map((isSelected:boolean,index:number)=>isSelected?this.skillSet[index]:null).filter((skill:string|null)=>skill!==null);
      const index = this.savedUserList.findIndex((exiUser)=>exiUser.name===userToSave.name);
      if(index>-1){
        this.savedUserList[index] = userToSave;
        Swal.fire({
          icon: "success",
          title: "Successfully updated.",
          showConfirmButton: false,
          timer: 1500
        });
      }else{
        this.savedUserList.push(userToSave);
        Swal.fire({
          icon: "success",
          title: "Successfully saved.",
          showConfirmButton: false,
          timer: 1500
        });
      }
      this.isFormSubmitted = false;
      this.regiForm.reset();
      this.skills.clear();
      this.initializeSkills();
    }else{
      Swal.fire({
        icon: "error",
        title: "Please fill all required fields!",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  checkForFieldValidationError(fieldName:string,errorType:string):boolean{
    return this.isFormSubmitted && this.regiForm.controls[fieldName].hasError(errorType);
  }

  onUpdate(user:UserDTO){
    if(user && user.name){
      const index = this.savedUserList.findIndex((exiUser)=>exiUser.name===user.name);
      if(index>-1){
        this.userDTO = user;
        this.loadFormData();
        this.skills.clear();
        this.initializeSkills();
        this.userDTO.skills.forEach((selectedSkill)=>{
          const index = this.skillSet.findIndex((skill)=>skill===selectedSkill);
          if(index>-1){
            this.skills.at(index).setValue(true);
          }
        })
      }else{
        Swal.fire({
          icon: "error",
          title: "failed to update! User does not exists.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  onDelete(user:UserDTO){
    if(user && user.name){
      Swal.fire({
        title: "Are you sure?",
        text: `Do you really want to delete user with name ${user.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.savedUserList.findIndex((exiUser)=>exiUser.name===user.name);
          if(index>-1){
            this.savedUserList.splice(index,1);
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
    }
  }

  onCancel(){
    this.regiForm.reset();
    this.skills.clear();
    this.initializeSkills();
  }

  checkForPuneDistrict(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value===null || control.value === 'Pune') ? null : { puneRegion: true };
    };
  }
}
