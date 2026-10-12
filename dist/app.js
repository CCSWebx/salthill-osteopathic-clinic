'use strict';
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded','false');
  nav.classList.remove('open')
}
menu.addEventListener('click',()=> {
  const open=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(open));
  nav.classList.toggle('open',open)
}
);
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=> {
  const wasOpen=nav.classList.contains('open');
  closeMenu();
  if(wasOpen) {
    const target=document.querySelector(a.getAttribute('href'));
    if(target) {
      target.setAttribute('tabindex','-1');
      target.focus( {
        preventScroll:true
      }
      );
    }
  }
}
));
matchMedia('(max-width:850px)').addEventListener('change',closeMenu);
document.addEventListener('keydown',e=> {
  if(e.key==='Escape'&&nav.classList.contains('open')) {
    closeMenu();
    menu.focus()
  }
}
);
const areas= {
  back:['Back & neck','Back and neck pain are among the concerns described by the clinic. Karl considers your history, posture and movement before discussing an appropriate approach.'],shoulders:['Shoulders','Shoulder problems, including tendon-related concerns, feature in the clinic’s published areas of care. Your consultation offers time to discuss symptoms and assess how your shoulder moves.'],hips:['Hips & pelvis','The clinic’s published information includes hip and pelvic problems. Karl considers your concern alongside your overall posture and movement.'],joints:['Knees & joints','Knee injuries, overuse concerns, ankle sprains and foot issues are included in the clinic’s published information. An assessment helps guide the next steps for your particular problem.'],muscles:['Muscles & tendons','Muscle and tendon problems are part of the practice’s hands-on approach. Treatment may include gentle stretches and muscle work, with advice tailored to the assessment.'],posture:['Posture & movement','Postural aches and pains are among the concerns people bring to the clinic. Karl assesses movement and posture and may suggest stretches or exercises.'],sport:['Sport & activity','The consultation can include advice around returning to sport and normal activity. Discuss your problem and the movements that matter to you with Karl.']
}
;
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab) {
  tabs.forEach(t=> {
    t.setAttribute('aria-selected',String(t===tab));
    t.tabIndex=t===tab?0:-1
  }
  );
  const data=areas[tab.dataset.area];
  document.querySelector('#area-title').textContent=data[0];
  document.querySelector('#area-text').textContent=data[1];
  document.querySelector('#area-panel').setAttribute('aria-labelledby',tab.id)
}
tabs.forEach((tab,i)=> {
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',e=> {
    let next;
    if(['ArrowDown','ArrowRight'].includes(e.key))next=(i+1)%tabs.length;
    if(['ArrowUp','ArrowLeft'].includes(e.key))next=(i+tabs.length-1)%tabs.length;
    if(e.key==='Home')next=0;
    if(e.key==='End')next=tabs.length-1;
    if(next!==undefined) {
      e.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus()
    }
  }
  )
}
);
const mq=matchMedia('(max-width:600px)');
function orient() {
  document.querySelector('[role=tablist]').setAttribute('aria-orientation',mq.matches?'horizontal':'vertical')
}
orient();
mq.addEventListener('change',orient);
document.querySelector('#copy-address').addEventListener('click',async()=> {
  const address='Salthill Osteopathic Clinic, 6 Monksfield, Salthill, Galway, H91 XN61, Ireland';
  try {
    await navigator.clipboard.writeText(address);
    document.querySelector('#copy-status').textContent='Address copied.'
  }
  catch {
    document.querySelector('#copy-status').textContent='Copy this address: '+address
  }
}
);
// Enable the demo action only after its prevention handler can be installed.
document.querySelector('#enquiry-form button[type=submit]').disabled=false;
document.querySelector('#enquiry-form').addEventListener('submit',e=> {
  e.preventDefault();
  document.querySelector('#form-status').textContent='Demo preview complete. Nothing has been sent or stored. Please call or email Karl for a real enquiry.';
  e.target.reset()
}
);
document.querySelector('#credits-button').addEventListener('click',e=> {
  const open=e.currentTarget.getAttribute('aria-expanded')!=='true';
  e.currentTarget.setAttribute('aria-expanded',String(open));
  document.querySelector('#credits').hidden=!open
}
);
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const observer=new IntersectionObserver(entries=>entries.forEach(e=> {
    if(e.isIntersecting) {
      e.target.classList.add('seen');
      observer.unobserve(e.target)
    }
  }
  ), {
    threshold:.15
  }
  );
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))
}
