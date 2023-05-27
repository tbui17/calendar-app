"use client"

import 'react-toastify/dist/ReactToastify.css';

import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
import { useState } from "react"

export function ToastButton(){
  const notify = () => toast("Wow so easy!");

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </div>
  );
}

interface IForm {
    inp1: string;
    inp2: string;
    inp3: string;
}

export function Form1(){
    
    const { register, handleSubmit, formState: { errors } } = useForm<IForm>();
    const onSubmit2: SubmitHandler<IForm> = data => console.log(data);
    async function onSubmit(input:IForm){
        await axios.post("/api/form", input)
        toast("Complete.")
    }
  
    
  
    return (
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <div> 
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <label>inp1</label>
        <input defaultValue="test" {...register("inp1")} className="block mb-2 text-sm font-medium bg-gray-600 text-white dark:text-white" />
        <br />
        
        {/* include validation with required or other standard HTML validation rules */}
        <label>inp2</label>
        <input {...register("inp2", { required: true })} className="block mb-2 text-sm font-medium bg-gray-600 text-white dark:text-white" />
        {/* errors will return when field validation fails  */}
        {errors.inp2 && <span>This field is required</span>}
        <br />
        <label>inp3</label>
        <input {...register("inp3")} className = "block mb-2 text-sm font-medium bg-gray-600 text-gray-900 dark:text-white"/>
        <br />
        <input type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" />
        
        
      </form>
      <ToastContainer theme="dark"/> 
      </div>
    );
}