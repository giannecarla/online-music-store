import '../App.css';
import React, { Fragment, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg';
import { Paper } from '@material-ui/core'

export default function PurchaseHistory(){
    return (
        <div>Historyyy</div>
    )
}