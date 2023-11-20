"use client"
import Image from 'next/image'
import { useState, Fragment } from 'react'
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { Combobox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import '../Styles/style.css'

<meta
name="format-detection"
content="telephone=no, date=no, email=no, address=no"
/> 

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2" style={{backgroundColor:'white'}}>
      <h1 className='mt-8'>Add New Accounts</h1>
      <div className="tabs" style={{width:"1000px"}}>
            <button className="selected-tab" name="basics">Basic Info </button>
            <button className="tab" name="products">Interest Info</button>
            <button className="tab" name="payment">Actions Info</button>
        </div>
                        
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
       
       <div className='allign'>
       <fieldset id="basicInfo" className='fieldset'> 
       <div className="row">
                <label className="label">On Lead ?</label>
                 <select name="contactPersonNameCombo" className="date-picker-text"></select>
            </div>
            <div className="row">
                <label className="label">Name</label>
                <input name="salesPersonCombo" className="date-picker-text"></input>
            </div>
            <div className="row">
                <label className="label">Gender</label>
                 <select name="orderType" className="date-picker-text"  ></select>
            </div>
            <div className="row" id="quotationSerial">
               <label className="label">Title</label>
                <select name="OfferSerialCombo" className="date-picker-text" ></select>    
            </div>
            <div className="row" id="companyRow">
                <label className="label">Phone</label>
                 <input name="companyNameCombo" className="date-picker-text" ></input>
                    
            </div>
            <div className="row" id="branchRow" >
                <label className="label">Email</label>
                 <input name="companyAddressCombo" className="date-picker-text" ></input>
            </div>
           </fieldset>
            
       </div>
      </div>
    </main>
  )
}
