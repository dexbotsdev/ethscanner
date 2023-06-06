import './App.css';
import { Stack, TextField, Button } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { HoneypotIsV1 } from '@normalizex/honeypot-is';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getPairInformationByChain } from 'dexscreener-api';

function App() {

  const valueRef = useRef('')
  const [open, setOpen] = useState(false);
  const defcont = '0x2eCBa91da63C29EA80Fbe7b52632CA2d1F8e5Be0';
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const [tokenScanData, setTokenScanData] = useState(undefined);
  const sendValue = async () => {
    handleOpen();
    const CHAIN_ID = 1;
    const honeypotis = new HoneypotIsV1();
     const BUSD = valueRef.current.value;

    if (BUSD !== undefined && BUSD !== "") {

      const BUSD_PAIRS = await honeypotis.getPairs(BUSD, CHAIN_ID);

      await honeypotis.honeypotScan(
        BUSD,
        BUSD_PAIRS[0].Router,
        BUSD_PAIRS[0].Pair,
        CHAIN_ID
      ).then((result) => {
        console.log(result)

        getPairInformationByChain("ethereum",result.PairAddress).then((response)=>{

          console.log(response);

          result.priceUsd=response.pair.priceUsd;
          result.priceNative=response.pair.priceNative;
          result.fdv=response.pair?.fdv?response.pair?.fdv:0;
          setTokenScanData(result)
        })
        handleClose();
      }).catch(Error => {
        handleClose();
      })
    } else {

      const BUSD_PAIRS = await honeypotis.getPairs(defcont, CHAIN_ID);

      await honeypotis.honeypotScan(
        defcont,
        BUSD_PAIRS[0].Router,
        BUSD_PAIRS[0].Pair,
        CHAIN_ID
      ).then((result) => {
        console.log(result)

        getPairInformationByChain("ethereum",result.PairAddress).then((response)=>{

          console.log(response);

          result.priceUsd=response.pair.priceUsd;
          result.priceNative=response.pair.priceNative;
          result.fdv=response.pair?.fdv?response.pair?.fdv:0;
          setTokenScanData(result)
        })
        
        handleClose();
      }).catch(Error => {
        handleClose();
      })
    }


    //on clicking button accesing current value of TextField and outputing it to console 
  }

  useEffect(() => {
    // Update the document title using the browser API
    sendValue();
  }, []);

  return (
    <div>

      <div style={{ 'marginTop': '60px', 'textAlign': 'center' }}>
        <TextField  
          inputRef={valueRef}
          placeholder="0x......."
          size='small'
          sx={{ 'backgroundColor': '#cdfdff', 'width': '50%' , 'borderRadius':'15px','border':'0px'}}
          InputProps={{
            endAdornment: (
              <Stack direction="row" spacing={1}>
                <Button sx={{ 'color': '#02feff' }} variant="contained" color="primary"
                  onClick={sendValue}>Search</Button>
              </Stack>
            ),
          }}
        />

      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {tokenScanData && <div>
        <div id="leftmenu">

          <div id="date_time">
            <div id="date" className="semi_arc e4">
              <div className="semi_arc_2 e4_1">
                <div className="counterspin4"></div>
              </div>
              <div style={{ 'fontSize': '20px', 'marginTop': '25px' }}>{Number(tokenScanData.SellTax).toFixed(2)}</div>
              <div style={{ 'fontSize': '20px' }}>Sell Tax</div>
            </div>

            <div id="time" className="arc e1">
              <div style={{ 'fontSize': '17px', 'marginLeft': '-10px', 'marginTop': '23px' }}>{Number(tokenScanData.BuyTax).toFixed(2)}</div>
               <div style={{ 'fontSize': '17px', 'marginTop': '10px' }}>Buy Tax</div>
            </div>
          </div>

          <p className="titleLeft">Token Info</p>
          <div className="hline title_underline"></div>

          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Name: {tokenScanData.Token.Name}</p>
          </span> <br />
          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Symbol: {tokenScanData.Token.Symbol}</p>
          </span> <br />
          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Decimals: {tokenScanData.Token.Decimals}</p>
          </span> <br />
          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Network: ETHEREUM</p>
          </span> <br />


          <p className="titleRight">HoneyPot?</p>
          <div className="hline title_underline"></div> 
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '30px' , marginTop:'20px'}}>{tokenScanData.isHoneypot?'Failed':'Passed'}</p>
           <br />

          <p className="titleRight">Socials</p>
          <div className="hline title_underline"></div> 
          <div className="menu">
            <button className="menuitem"> <span className="entypo-right-open"/> <p className="caption">Twitter</p> </button>
            <button className="menuitem"> <span className="entypo-right-open"/> <p className="caption">Roadmap</p> </button>
            <button className="menuitem"> <span className="entypo-right-open"/> <p className="caption">Presale</p> </button>
            <button className="menuitem"> <span className="entypo-right-open"/> <p className="caption">Telegram</p> </button>
                </div>
        </div>
        <div id="rightmenu"> 

        <p className="titleRight">Price Info</p>
          <div className="hline title_underline"></div> 
 

          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Price(USD): {tokenScanData.priceUsd}</p>
          </span> <br />


          <span className="menuitem entypo-gauge" style={{ 'fontSize': '30px', 'marginLeft': '10px' }}>
            <p id="cpu" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Price(ETH): {tokenScanData.priceNative}</p>
          </span> <br /><br /><br /><br />

          <span className="menuitem entypo-chart-area" style={{ 'fontSize': '10px', 'marginLeft': '10px' }}>
            <p id="ram" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>Liquidity: {Number(tokenScanData.Pair.Liquidity).toFixed(0)}</p>
          </span> <br />
          <span className="menuitem entypo-chart-area" style={{ 'fontSize': '10px', 'marginLeft': '10px' }}>
            <p id="ram" className="caption" style={{ 'fontSize': '20px', 'marginLeft': '10px' }}>MarketCap: {Number(tokenScanData.fdv).toFixed(0)}</p>
          </span> <br />
          <br /><br /><br />
          <p className="titleRight">Network Info</p>
          <div className="hline title_underline"></div> 
          <div id="date_time">
            <div id="date" className="semi_arc e4"> 
              <div className="semi_arc_2 e4_1">
                <div className="counterspin4"></div>
              </div>
              <div style={{ 'fontSize': '20px', 'marginTop': '25px' }}>{tokenScanData.BuyGas}</div>
              <div style={{ 'fontSize': '25px' }}>Buy Gas</div>
            </div>

            <div id="time" className="arc e1">
              <div style={{ 'fontSize': '20px', 'marginLeft': '-10px', 'marginTop': '23px' }}>{tokenScanData.SellGas}</div>
               <div style={{ 'fontSize': '17px', 'marginTop': '10px' }}>Sell Gas</div>
            </div>
          </div>

          <div id="date_time2">
            <div id="date" className="semi_arc e4">
              <div className="semi_arc_2 e4_1">
                <div className="counterspin4"></div>
              </div>
              <div style={{ 'fontSize': '20px', 'marginTop': '25px' }}>{Number(tokenScanData.SellTax).toFixed(2)}</div>
              <div style={{ 'fontSize': '20px' }}>Sell Tax</div>
            </div>

            <div id="time" className="arc e1">
              <div style={{ 'fontSize': '17px', 'marginLeft': '-10px', 'marginTop': '23px' }}>{Number(tokenScanData.BuyTax).toFixed(2)}</div>
               <div style={{ 'fontSize': '17px', 'marginTop': '10px' }}>Buy Tax</div>
            </div>
          </div>

        </div>
        <div id="arc_container">
          <div className="arc_reactor">
            <div className="case_container">
              <div className="e7">
                <div className="semi_arc_3 e5_1">
                  <div className="semi_arc_3 e5_2">
                    <div className="semi_arc_3 e5_3">
                      <div className="semi_arc_3 e5_4"></div>
                    </div>
                  </div>
                </div>
                <div className="core2"></div>
              </div>
              <ul className="marks">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
        <canvas id="particle1" width="20" height="500"></canvas>
        <script>
          var canvas = document.getElementById('particle1');
          var context = canvas.getContext('2d');
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(0, 70);
          context.lineTo(10, 85);
          context.lineTo(10, 135);
          context.lineTo(0, 150);
          context.lineTo(0, 480);
          context.lineTo(5, 490);
          context.lineTo(10, 490);
          context.lineTo(20, 490);
          context.lineTo(20, 250);
          context.lineTo(10, 235);
          context.lineTo(10, 185);
          context.lineTo(20, 170);
          context.lineTo(20, 40);
          context.lineTo(10, 30);
          context.lineTo(10, 20);
          context.closePath();
          context.lineWidth = 1;
          context.fillStyle = 'rgba(2,254,255,0.3)';
          context.fill();
          context.strokeStyle = 'transparent';
          context.stroke();
        </script>

        <canvas id="particle1_1" width="40" height="510"></canvas>
        <script>
          var canvas = document.getElementById('particle1_1');
          var context = canvas.getContext('2d');
          context.beginPath();
          context.lineTo(0, 0);
          context.lineTo(10, 15);
          context.lineTo(10, 65);
          context.lineTo(0, 80);
          context.lineTo(0, 0);
          context.closePath();
          context.lineWidth = 1;
          context.fillStyle = 'rgba(2,254,255,0.3)';
          context.fill();
          context.strokeStyle = 'transparent';
          context.stroke();
        </script>

        <canvas id="particle1_2" width="40" height="510"></canvas>
        <script>
          var canvas = document.getElementById('particle1_2');
          var context = canvas.getContext('2d');
          context.beginPath();
          context.lineTo(10, 80);
          context.lineTo(0, 65);
          context.lineTo(0, 15);
          context.lineTo(10, 0);
          context.lineTo(10, 80);
          context.closePath();
          context.lineWidth = 1;
          context.fillStyle = 'rgba(2,254,255,0.3)';
          context.fill();
          context.strokeStyle = 'transparent';
          context.stroke();
        </script>

        <div id="particle1_3">
  > > > >
        </div>

        <div id="particle2">▶<br />▶<br />▶</div>
        <div id="particle3" className="vline" />
        <div id="particle4" className="vline" />
        <div id="particle5" className="vline" />
        <div id="particle6" className="vline" />
        <div id="particle7" className="vline" />
        <div id="particle8" className="vline" />
        <div id="particle9" className="vline" />
      </div>}
    </div>
  );
}

export default App;
