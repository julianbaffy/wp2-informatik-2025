<script lang="ts">
	import Screensaver from '$lib/images/Screensaver.png';
</script>

<div class='device-collection'>
  <div class='phone-container'>
    <div class='device phone'>
      <img src={Screensaver}>
    </div>
  </div>
  <div class='tablet-container'>
    <div class='device tablet'>
      <img src={Screensaver}>
    </div>
  </div>
  <div class='device desktop'>
    <img src={Screensaver}>
  </div>
</div>

<!--
<div class='container'>
  <div class='device phone'>
    <img src='https://placehold.it/187x333'>
  </div>
</div>
<div class='container'>
  <div class='device phone landscape'>
    <img src='https://placehold.it/333x187'>
  </div>
</div>
<div class='container'>
  <div class='device tablet'>
    <img src='https://placehold.it/384x512'>
  </div>
</div>
<div class='container'>
  <div class='device tablet landscape'>
    <img src='https://placehold.it/512x384'>
  </div>
</div>
<div class='container'>
  <div class='device laptop'>
    <img src='https://placehold.it/640x360'>
  </div>
</div>
<div class='container'>
  <div class='device desktop'>
    <img src='https://placehold.it/960x540'>
  </div>
</div>-->

<style>
    .device {
    border-radius: 6px;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    box-shadow: inset 0 4px 7px 1px #fff,
        inset 0 -5px 20px rgba(173, 186, 204, .25),
        0 2px 6px rgba(0, 21, 64, .14),
        0 10px 20px rgba(0, 21, 64, .05);
    }

    .device img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, .24);
    object-fit: cover;
    }

    .device::before,
    .device::after {
    content: "";
    display: block;
    position: absolute;
    background: #fff;
    box-shadow: inset 0 4px 7px 1px #fff,
        inset 0 -5px 20px rgba(173, 186, 204, .25),
        0 2px 6px rgba(0, 21, 64, .14),
        0 10px 20px rgba(0, 21, 64, .05);
    }

    .phone {
    padding: 12% 3%;
    aspect-ratio: 187/333;
    }

    .phone.landscape {
    padding: 1.75% 8%;
    }

    .tablet {
    padding: 8% 2%;
    aspect-ratio: 384/512;
    }

    .tablet.landscape {
    padding: 1.12% 6%;
    }

    .laptop {
    margin-left: 12%;
    margin-right: 12%;
    margin-bottom: 2.5%;
    border-radius: 1vw;
    padding: 1.35%;
    }

    .desktop {
    margin-bottom: 11%;
    border-radius: 0.5vw;
    padding: 1.5%;
    aspect-ratio: 960/540;
    }

    .phone::after {
    border-radius: 50%;
    margin: 0 auto 2%;
    left: 0;
    right: 0;
    bottom: 0;
    width: 10%;
    height: 0;
    padding-top: 10%;
    box-shadow: inset 0 0 5px 1px rgba(0, 0, 0, .12);
    }

    .phone.landscape::after {
    margin: auto 0;
    left: calc(100% - 7%);
    top: 0;
    bottom: 0;
    width: 6%;
    padding-top: 6%;
    }

    .phone::before {
    border-radius: 50px;
    margin: 5.5% auto 0;
    left: 0;
    right: 0;
    top: 0;
    width: 20%;
    height: 1%;
    box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, .12);
    }

    .phone.landscape::before {
    margin: auto 0 auto 4.5%;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1%;
    height: 20%;
    }

    .tablet::after {
    border-radius: 50%;
    margin: 0 auto 2%;
    left: 0;
    right: 0;
    bottom: 0;
    width: 6%;
    height: 0;
    padding-top: 6%;
    box-shadow: inset 0 0 5px 1px rgba(0, 0, 0, .12);
    }

    .tablet.landscape::after {
    margin: auto 0;
    left: calc(100% - 5.25%);
    top: 0;
    bottom: 0;
    width: 4.5%;
    padding-top: 4.5%;
    }

    .tablet::before {
    border-radius: 50%;
    margin: 3.5% auto 0;
    left: 0;
    right: 0;
    top: 0;
    width: 2.25%;
    height: 0;
    padding-top: 2.25%;
    background: #eee;
    box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, .12);
    }

    .tablet.landscape::before {
    margin: auto 0 auto 2.5%;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1.75%;
    padding-top: 1.75%
    }

    .laptop::after {
    border-radius: 4px 4px 48px 48px;
    left: -15%;
    bottom: -4%;
    width: 130%;
    height: 7%;
    }

    .desktop::before {
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: -18%;
    width: 20%;
    height: 20%;
    background: #fafafa;
    z-index: -1;
    }

    .desktop::after {
    border-radius: 4px 4px 24px 24px;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: -19.5%;
    width: 34%;
    height: 2%;
    }

    .device-collection {
    width: 100%;
    position: relative;
    }

    .device-collection::after {
    content: "";
    display: block;
    padding-top: 62.75%;
    }

    .device-collection .phone-container,
    .device-collection .tablet-container,
    .device-collection .desktop {
    position: absolute;
    bottom: 0;
    }

    .device-collection .phone,
    .device-collection .tablet {
    margin: 0;
    }

    .device-collection .phone-container {
    left: 0;
    max-width: 15%;
    z-index: 2;
    }

    .device-collection .tablet-container {
    right: 0;
    max-width: 30%;
    z-index: 1;
    }

    .device-collection .desktop {
    left: 0;
    right: 0;
    margin: 0 5% 10.25%;
    }

    @media (max-width: 800px) {
    .device-collection .device {
        border-radius: 5px;
    }
    }

    .device-collection {
    max-width: 100%;
    margin: 40px;
    }

    * {
    box-sizing: border-box;
    position: relative;
    transition: all .3s ease
    }
</style>