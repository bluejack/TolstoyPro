/* ======================================================================== *\
   
   About Page
   
   Mostly, a FAQ

\* ======================================================================== */

import ModalPage from './ModalPage.js';

export default class AboutPage extends ModalPage {
  constructor() {
    super('About TolstoyPro', true, 'about');
    this.html = `
<div id="about_page" class="static_page">
  <h2>F.A.Q.</h2>
  <dl>
  <dt>Is TolstoyPro really ready for prime time?</dt>
  <dd>No! That is why it is currently in "alpha release."</dd>
  <dt>What does that mean, "Alpha Release"?</dt>
  <dd>Alpha comes before beta, and there is no guarantee that it works well
      on all browsers or devices, and there may be bugs -- including serious
      bugs. It may not work consistently all the time because substantial
      work remains under development.</dd>
  <dt>When Will TolstoyPro be out of Alpha?</dt>
  <dd>We are currently targeting July of 2022. By this time we expect to be
      sufficiently "feature complete" to offer a compelling and reasonably
      robust product. We will then spend another six months or so in "Beta." 
      The hope is to have a very solid, secure application by 2023, at which
      point we will formally release Version 1.0 of TolstoyPro to subscribers.</dd>
  <dt>Can I get a break on pricing because I am an alpha/beta user?</dt>
  <dd>When we launch our kickstarter, please chip in there at whatever level
      makes sense for you. All kickstarter contributors will get a break!</dd>
  <dt>I joined the kickstarter... will I have to start subscribing?</dt>
  <dd>That depends on which kickstarter tier you chose. Every kickstarter
      tier gets some discount or deferral of subscription pricing. Please 
      review the kickstarter page for the terms you signed up for.</dd>
  <dt>Why is this going be a paid app?</dt>
  <dd>As writers, we are constantly fighting to make a living. This is true
      for indie software developers also. We want to keep expanding, extending,
      and improving TolstoyPro... and we want to pay the rent. You know how it
      is. However, we will always make this as affordable as possible, and the 
      more people who use it, the more we can reduce the price!</dd>
  <dt>There are so many apps out there already, why another?</dt>
  <dd>There are many wonderful apps out there; some that I have used for
      years. But nothing quite made me happy; none of them satisfied exactly
      what I wanted. So I made this for myself. And if it's useful for 
      others, then great!</dd>
  </dl>  
</div>
    `;
  }
}