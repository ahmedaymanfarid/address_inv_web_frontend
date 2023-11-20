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
      <h1 className='mt-8'>New Leads</h1>
      <hr className='my-6' style={{borderTop:'1px solid black', width:"1000px"}}/>
                        
      <div className='inline'>
      <select className='dropdown mx-4 font-bold'>
        <option value="1"> Assigned To : </option>
      </select>
      <select className='dropdown mx-4 font-bold'>
        <option value="1"> Unit Type : </option>
      </select>
      <select className='dropdown mx-4 font-bold'>
        <option value="1"> Destination Type :</option>
      </select>
      <input className='customInput dropdown mx-4 font-bold' style={{ color: 'black' }} placeholder='Search for Leads'>
      </input>
      <button className='button dropdown mx-4 font-bold' >+ ADD NEW LEAD</button>
      </div>
      <hr className='my-6' style={{borderTop:'1px solid black', width:"1000px"}}/>
                        
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-24">
       
       <div className='allignblock'>
               
                    <div className='contactsBlack'>
                        <h3 className='label'>Ahmed Ayman</h3>
                        <h3 className='assignedTag'> Assigned </h3>
                        <hr style={{borderTop:'1px solid orange', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contactsBlack'>
                        <h3 className='label mr-14'>Salma Ahmed</h3>
                        <h3 className='notAssignedTag'> Not Assigned </h3>
                        <hr style={{borderTop:'1px solid red', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                
                    <div className='contactsBlack'>
                        <h3 className='label mr-14'>Mariam Tamer</h3>
                        <h3 className='notAssignedTag'>Not Assigned </h3>
                        <hr style={{borderTop:'1px solid red', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                   
            </div>
                    <div className='contactsBlack'>
                        <h3 className='label mr-14'>Omar Khaled</h3>
                        <h3 className='actionTakenTag'> Action Taken </h3>
                        <hr style={{borderTop:'1px solid blue', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contactsBlack'>
                        <h3 className='label mr-14'>Yomna Ihab</h3>
                        <h3 className='assignedTag'> Assigned </h3>
                        <hr style={{borderTop:'1px solid orange', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contactsBlack mb-4'>
                        <h3 className='label mr-16'>Karim Mohamed</h3>
                        <h3 className='actionTakenTag'> Action Taken </h3>
                        <hr style={{borderTop:'1px solid blue', margin:"14px"}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
           
       </div>
      </div>
    </main>
  )
}
