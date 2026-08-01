(function(){
  'use strict';

  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const track=(name,params={})=>{
    try{ if(typeof window.gtag==='function') window.gtag('event',name,params); }catch(_e){}
  };
  window.homewardTrack=track;

  // Mobile navigation
  const menuToggle=$('.mobile-toggle');
  const mobileMenu=$('.mobile-menu');
  if(menuToggle&&mobileMenu){
    menuToggle.addEventListener('click',()=>{
      const open=mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded',String(open));
      menuToggle.textContent=open?'×':'☰';
    });
    $$('a,button',mobileMenu).forEach(el=>el.addEventListener('click',()=>{
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.textContent='☰';
    }));
  }

  // Reveal animation
  const revealItems=$$('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }),{threshold:.1});
    revealItems.forEach(el=>observer.observe(el));
  } else revealItems.forEach(el=>el.classList.add('visible'));

  // FAQ accordions
  $$('.faq-question').forEach(button=>button.addEventListener('click',()=>{
    const item=button.closest('.faq-item');
    const open=item.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
  }));

  // Generic analytics click events
  $$('[data-event]').forEach(el=>el.addEventListener('click',()=>{
    track(el.dataset.event,{link_text:(el.textContent||'').trim().slice(0,100),page_path:location.pathname});
  }));

  // Preserve intended interest across page changes.
  $$('[data-set-interest]').forEach(el=>el.addEventListener('click',()=>{
    const choice=el.dataset.setInterest||'';
    try{sessionStorage.setItem('homeward_interest_choice',choice);}catch(_e){}
    const localSelect=$('#interestChoice');
    if(localSelect && Array.from(localSelect.options).some(o=>o.value===choice)) localSelect.value=choice;
  }));
  const interestSelect=$('#interestChoice');
  if(interestSelect){
    try{
      const stored=sessionStorage.getItem('homeward_interest_choice');
      if(stored && Array.from(interestSelect.options).some(o=>o.value===stored)){
        interestSelect.value=stored;
        sessionStorage.removeItem('homeward_interest_choice');
      }
    }catch(_e){}
  }

  // Attribution: latest touch plus original landing page/referrer.
  const params=new URLSearchParams(location.search);
  const attrKeys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
  const latest={};
  attrKeys.forEach(k=>{ if(params.get(k)) latest[k]=params.get(k); });
  try{
    if(!localStorage.getItem('homeward_first_landing')){
      localStorage.setItem('homeward_first_landing',location.href);
      localStorage.setItem('homeward_first_referrer',document.referrer||'');
    }
    if(Object.keys(latest).length) localStorage.setItem('homeward_latest_attribution',JSON.stringify(latest));
  }catch(_e){}

  const fillAttribution=(form)=>{
    let saved={};
    try{saved=JSON.parse(localStorage.getItem('homeward_latest_attribution')||'{}');}catch(_e){}
    attrKeys.forEach(k=>{
      const input=form.querySelector(`[name="${k}"]`);
      if(input) input.value=params.get(k)||saved[k]||'';
    });
    const landing=form.querySelector('[name="landing_page"]');
    const referrer=form.querySelector('[name="referrer"]');
    try{
      if(landing) landing.value=localStorage.getItem('homeward_first_landing')||location.href;
      if(referrer) referrer.value=localStorage.getItem('homeward_first_referrer')||document.referrer||'';
    }catch(_e){
      if(landing) landing.value=location.href;
      if(referrer) referrer.value=document.referrer||'';
    }
  };

  // Calendar modal
  const calendarModal=$('#calendarModal');
  const openCalendar=()=>{
    if(!calendarModal){ location.href='connect.html'; return; }
    const frame=$('iframe',calendarModal);
    if(frame&&!frame.src) frame.src=frame.dataset.src;
    calendarModal.classList.add('open');
    calendarModal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    $('.calendar-close',calendarModal)?.focus();
    track('calendar_open',{page_path:location.pathname});
  };
  const closeCalendar=()=>{
    if(!calendarModal)return;
    calendarModal.classList.remove('open');
    calendarModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  };
  $$('[data-calendar-open]').forEach(el=>el.addEventListener('click',openCalendar));
  if(calendarModal){
    $('.calendar-close',calendarModal)?.addEventListener('click',closeCalendar);
    calendarModal.addEventListener('click',e=>{if(e.target===calendarModal)closeCalendar();});
  }

  // Interest form -> Netlify function -> Airtable
  const form=$('#interestForm');
  if(form){
    fillAttribution(form);
    let formStarted=false;
    $$('input,select,textarea',form).forEach(field=>field.addEventListener('focus',()=>{
      if(!formStarted){formStarted=true;track('interest_form_start',{page_path:location.pathname});}
    },{once:true}));

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const status=$('#formStatus');
      const submit=$('button[type="submit"]',form);
      if(!form.reportValidity())return;
      fillAttribution(form);
      const selected=interestSelect?.value||'';
      const original=submit.textContent;
      submit.disabled=true;submit.textContent='Sending…';
      status.className='form-status';status.textContent='';
      try{
        const response=await fetch(form.dataset.endpoint||'/api/lead',{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
        let result={};
        try{result=await response.json();}catch(_e){}
        if(!response.ok||result.ok!==true) throw new Error(result.error||`Request failed (${response.status})`);
        form.style.display='none';
        $('#formSuccess')?.classList.add('open');
        track('interest_form_submit',{interest_choice:selected,page_path:location.pathname});
        try{localStorage.setItem('homeward_interest_submitted','1');}catch(_e){}
        hideInterestPrompt(true);
        $('#formSuccess')?.scrollIntoView({behavior:'smooth',block:'center'});
        if(result.preview===true){
          const panel=$('#formSuccess');
          if(panel){
            const heading=$('h3',panel),copy=$('p',panel);
            if(heading) heading.textContent='Preview submission received.';
            if(copy) copy.textContent='This sandbox test was not added to the live Homeward CRM.';
          }
        }
        if(/conversation|talk about|talk with|speak with/i.test(selected)) setTimeout(openCalendar,650);
      }catch(error){
        console.error('Homeward form error',error);
        status.className='form-status error';
        status.innerHTML='We could not send the form just now. Please try again, or <a href="connect.html" style="font-weight:700;text-decoration:underline">choose a time through the conversation calendar</a>.';
        track('interest_form_error',{error:String(error.message||error),page_path:location.pathname});
      }finally{
        submit.disabled=false;submit.textContent=original;
      }
    });
  }

  // Half-page interest prompt. Dismissal lasts seven days.
  const prompt=$('#interestPrompt');
  let promptShown=false;
  const dismissKey='homeward_interest_prompt_dismissed_until';
  const shouldShowPrompt=()=>{
    if(!prompt||!$('#interest'))return false;
    try{
      if(localStorage.getItem('homeward_interest_submitted')==='1')return false;
      return Number(localStorage.getItem(dismissKey)||0)<Date.now();
    }catch(_e){return true;}
  };
  const showInterestPrompt=()=>{
    if(promptShown||!shouldShowPrompt())return;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(max>0 && window.scrollY/max>=.45){
      promptShown=true;prompt.classList.add('open');track('interest_prompt_view',{page_path:location.pathname});
    }
  };
  const hideInterestPrompt=(permanent=false)=>{
    if(!prompt)return;
    prompt.classList.remove('open');
    if(permanent){try{localStorage.setItem(dismissKey,String(Date.now()+7*24*60*60*1000));}catch(_e){}}
  };
  $('.interest-prompt-close',prompt||document)?.addEventListener('click',()=>{hideInterestPrompt(true);track('interest_prompt_dismiss');});
  $$('a,button',prompt||document).forEach(el=>el.addEventListener('click',()=>hideInterestPrompt(true)));
  if(prompt) window.addEventListener('scroll',showInterestPrompt,{passive:true});

  // Vision lightbox
  const lightboxItems=$$('[data-lightbox]');
  const lightbox=$('#lightbox');
  if(lightbox&&lightboxItems.length){
    const image=$('.lightbox-image',lightbox),caption=$('.lightbox-caption',lightbox);
    let current=0;
    const show=i=>{
      current=(i+lightboxItems.length)%lightboxItems.length;
      const item=lightboxItems[current];
      image.src=item.dataset.lightbox;
      image.alt=$('img',item)?.alt||item.dataset.title||'Homeward future vision';
      caption.textContent=item.dataset.title||'';
    };
    const open=i=>{show(i);lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');};
    const shut=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');};
    lightboxItems.forEach((item,i)=>item.addEventListener('click',()=>open(i)));
    $('.lightbox-close',lightbox)?.addEventListener('click',shut);
    $('.lightbox-prev',lightbox)?.addEventListener('click',()=>show(current-1));
    $('.lightbox-next',lightbox)?.addEventListener('click',()=>show(current+1));
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)shut();});
    document.addEventListener('keydown',e=>{
      if(!lightbox.classList.contains('open'))return;
      if(e.key==='Escape')shut();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);
    });
  }

  // Five-minute practice timer
  const player=$('[data-practice-player]');
  if(player){
    const initial=Number(player.dataset.duration||300);
    let remaining=initial,timer=null,inhale=true;
    const display=$('.timer-display',player),cue=$('.breath-cue',player);
    const render=()=>{display.textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;};
    const setCue=()=>{cue.textContent=inhale?'Breathing in, I receive peace.':'Breathing out, I offer love.';inhale=!inhale;};
    const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
    $('[data-timer-start]',player)?.addEventListener('click',()=>{
      if(timer)return;setCue();let cueCount=0;
      timer=setInterval(()=>{
        remaining=Math.max(0,remaining-1);cueCount++;render();
        if(cueCount%5===0)setCue();
        if(remaining===0){stop();cue.textContent='Rest for one more breath. The practice is complete.';track('practice_complete',{practice:'breath_prayer'});}
      },1000);
    });
    $('[data-timer-pause]',player)?.addEventListener('click',()=>{stop();cue.textContent='Paused. Continue whenever you are ready.';});
    $('[data-timer-reset]',player)?.addEventListener('click',()=>{stop();remaining=initial;inhale=true;render();cue.textContent='Press begin when you are ready.';});
    render();
  }

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCalendar();});
})();
