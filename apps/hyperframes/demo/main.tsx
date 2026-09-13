import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {ParentView} from '../../web/src/features/archive/components/parent-view';
import {TimelineView} from '../../web/src/features/archive/components/timeline-view';
import {FamilySettings} from '../../web/src/features/archive/components/family-settings';
import {Brand} from '../../web/src/components/brand';
import '../../web/src/styles.css';
import '../../web/src/apricot.css';
import '../../web/src/integration.css';
import '../../web/src/parity.css';
import '../../web/src/features/archive/primary-button.css';
import {ArchiveApp} from '../../web/src/features/archive/components/archive-app';
const child={id:'demo-child',slug:'emma',displayName:'Emma',birthDate:'2020-03-14',profileKind:'child',childAccessEnabled:0};
const base={childId:child.id,createdAt:'2026-09-09',createdByUserId:'demo-parent',authorName:'Alex',audience:'family',mediaId:null,mediaType:null,contentType:null,byteSize:null};
let demoMemories=[{...base,id:'story',kind:'story',title:'The moon is a night-light',body:'On the way home, you asked who turns it off in the morning. I hope I always remember that.',happenedAt:'2026-09-09'},{...base,id:'milestone',kind:'milestone',title:'Your first wobbly bike ride',body:'Three pedals. A big grin. And then: “Again!”',happenedAt:'2026-09-08'},{...base,id:'letter',kind:'letter',title:'For an ordinary Tuesday',body:'You don’t have to do anything extraordinary to be loved.',happenedAt:'2026-09-07'}];
const state={archive:{id:'demo',name:'Our little family',slug:'demo',timezone:'America/New_York',createdAt:'2026-01-01'},currentMember:{id:'parent',role:'owner',userId:'demo-parent'},members:[{id:'parent',userId:'demo-parent',role:'owner',joinedAt:'2026-01-01',name:'Alex',email:'alex@example.com'},{id:'grandma',userId:'grandma',role:'contributor',joinedAt:'2026-01-01',name:'Grandma June',email:'june@example.com'}],children:[child],memories:demoMemories,capsules:[],invitations:[],billing:{plan:'family',status:'active',usedBytes:0,limitBytes:25000000000,trialEndsAt:null,currentPeriodEndsAt:null,interval:'yearly',cancelAtPeriodEnd:false,checkoutAvailable:false,canManage:false,canCreateContent:true,environment:'test_mode'}};
// Only local fictional state. No real auth, analytics, email or persistence.
const nativeFetch=window.fetch.bind(window);
window.fetch=async(input,init)=>{const url=typeof input==='string'?input:input instanceof Request?input.url:input.toString();if(url.includes('/api/')){if(url.includes('/memories')&&init?.method==='POST'){const data=JSON.parse(String(init.body));demoMemories=[{...base,...data,id:'new-demo-memory'},...demoMemories];return Response.json({memory:{id:'new-demo-memory'},id:'new-demo-memory'});}if(url.endsWith('/archives'))return Response.json({archives:[]});if(url.endsWith('/archive'))return Response.json({...state,memories:demoMemories});return Response.json({});}return nativeFetch(input,init);};
function CaptureApp(){useEffect(()=>{if(new URLSearchParams(location.search).has('compose')){const timer=setInterval(()=>{const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.includes('Add a memory'));if(b){b.click();clearInterval(timer)}},100);return()=>clearInterval(timer)}},[]);return <ArchiveApp/>}
createRoot(document.getElementById('root')!).render(<CaptureApp/>);
