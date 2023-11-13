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


const people = [
    { id: 1, name: 'Durward Reynolds' },
    { id: 2, name: 'Kenton Towne' },
    { id: 3, name: 'Therese Wunsch' },
    { id: 4, name: 'Benedict Kessler' },
    { id: 5, name: 'Katelyn Rohan' },
  ]
  
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

export default function Home() {

    const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2" style={{backgroundColor:'white'}}>
      <h1 className='mt-8'>My Accounts</h1>
      <hr className='my-6' style={{borderTop:'1px solid black', width:"1000px"}}/>
                        
      <div className='inline'>
      <select className='dropdown mx-4'>
        <option value="1"> Assigned To : </option>
      </select>
      <select className='dropdown mx-4'>
        <option value="1"> Unit Type : </option>
      </select>
      <select className='dropdown mx-4'>
        <option value="1"> Destination Type :</option>
      </select>
      <input className='customInput dropdown mx-4' style={{ color: 'black' }} placeholder='Search for Accounts'>
      </input>
      <button className='button dropdown mx-4' >+ ADD ACCOUNT</button>
      </div>
      <hr className='my-6' style={{borderTop:'1px solid black', width:"1000px"}}/>
                        
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
       
       <div className='allign'>
            <div className='card'>
                <div className='card2'>
                   <h3 className='label'>
                        Hot 
                    </h3>
                    <h3 className='numH'>
                        2
                    </h3>
                    </div>
                    <div className='contacts'>
                        <h3 className='label'>Ahmed Ayman</h3>
                        <hr style={{borderTop:'1px solid red', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contacts'>
                        <h3 className='label'>Salma Ahmed</h3>
                        <hr style={{borderTop:'1px solid red', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                
            </div>
            <div className='card'>
            <div className='card2'>
                    <h3 className='label'>
                        Warm
                    </h3><h3 className='numW'>
                        1
                    </h3>
                    </div>
                    <div className='contacts'>
                        <h3 className='label'>Mariam Tamer</h3>
                        <hr style={{borderTop:'1px solid orange', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
            </div>
            <div className='card'>
            <div className='card2'>
                    <h3 className='label'>
                        Cold
                    </h3>
                    <h3 className='numC'>
                        3
                    </h3></div>
                    <div className='contacts'>
                        <h3 className='label'>Omar Khaled</h3>
                        <hr style={{borderTop:'1px solid blue', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contacts'>
                        <h3 className='label'>Yomna Ihab</h3>
                        <hr style={{borderTop:'1px solid blue', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
                    <div className='contacts'>
                        <h3 className='label'>Karim Mohamed</h3>
                        <hr style={{borderTop:'1px solid blue', marginRight:10,marginLeft:10}}/>
                        <div style={{margin:10}}>
                        <h4>⭐ CEO</h4>
                        <h4>📞 (+20) 1063214506</h4>
                        <h4>🏠 Villa</h4>
                        <h4>💰 Budget Range: 6M-8M</h4>
                        </div>
                    </div>
            </div>
       </div>
      </div>
    </main>
  )
}
