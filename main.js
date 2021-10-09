enchant();
function Game_load(width,height){
  var game = new Game(width,height);
  game.fps = 20;
  game.onload = function(){
    var Chat_Scene = function(Datas){

      var scene = new Scene();

      var Kaigyo = 0;
      var Kaigyo_S = 0;
      var Match = null;
      for (var i = 0; i < Object.keys(Datas).length; i++) {
        if(Datas[Object.keys(Datas)[i]].text){
          Match = Datas[Object.keys(Datas)[i]].text.match(/●/g);
          if(Match){
            for(var k = 0; k < Match.length; k++){
            Kaigyo = Datas[Object.keys(Datas)[i]].text.indexOf("●");
            Kaigyo = Kaigyo%18;
            Kaigyo = 18 - Kaigyo;
            Kaigyo_S = "";
            for (var j = 0; j < Kaigyo; j++) {
              Kaigyo_S += " ";
            }
            Datas[Object.keys(Datas)[i]].text = Datas[Object.keys(Datas)[i]].text.replace(Match[k],Kaigyo_S);
          };
          };
        };
      };

      var i = 1;
      var Image = [];
      var Images_Data = {};
      var Cut = true;

      function Images(w,h,x,y,a,b){
        Image[i] = new Sprite();
        Image[i]._element = document.createElement("img");
        if(a) Image[i]._element.src = a;
        else Image[i]._element.src = "透明.png";
        Image[i].width = w;
        Image[i].height = h;
        Image[i].x = x;
        Image[i].y = y;
        Image[i].name = b;
        Images_Data[b] = i;
        scene.addChild(Image[i]);
        i++;
        return;
      }

      if(Datas.image){
        while(Datas.image[i]){
          Images(0,0,0,0,0,Datas.image[i].name);
        };
      };

      Images(width,height,0,0,"透明.png","背景");
      Images(width,400,0,480,"textbox.png","テキストボックス");
      Image[Images_Data.テキストボックス].opacity = 0.5;

      var Numbers = 450;

      function Texts(){
        if(i%18==0) Numbers += 62;
        Text[i] = new Sprite();
        Text[i]._element = document.createElement("innerHTML");
        Text[i]._style.font  = "60px monospace";
        Text[i]._style.color = "white";
        Text[i].x = 62 * (i%18) + 180;
        Text[i].y = Numbers;
        scene.addChild(Text[i]);
      }

      var ChoiceText = [];

      function Choice(Number){
        ChoiceText[Number] = new Sprite();
        ChoiceText[Number]._element = document.createElement("innerHTML");
        ChoiceText[Number]._style.font  = "60px monospace";
        ChoiceText[Number]._style.color = "white";
        ChoiceText[Number].x = 1000;
        ChoiceText[Number].y = 400 - Number * 90;
        ChoiceText[Number].opacity = 0;
        Images(600,80,ChoiceText[Number].x-20,ChoiceText[Number].y-10,"textbox.png","選択肢"+Number);
        scene.addChild(ChoiceText[Number]);
        Image[Images_Data["選択肢"+Number]].opacity = 0;
      }

      for(var i = 0; i < 90; i++) Texts();

      for(var j = 0; j < 5; j++) Choice(j);

      var k = 1;
      if(Datas[k].image){
        i = 1;
        while(Datas[k].image[i]){
          if(Datas[k].image[i].src){
            Image[Images_Data[Datas[k].image[i].name]]._element.src = Datas[k].image[i].src;
          }
          if(Datas[k].image[i].width){
            Image[Images_Data[Datas[k].image[i].name]].width = Datas[k].image[i].width;
          }
          if(Datas[k].image[i].height){
            Image[Images_Data[Datas[k].image[i].name]].height = Datas[k].image[i].height;
          }
          if(Datas[k].image[i].x){
            Image[Images_Data[Datas[k].image[i].name]].x = Datas[k].image[i].x;
          }
          if(Datas[k].image[i].y){
            Image[Images_Data[Datas[k].image[i].name]].y = Datas[k].image[i].y;
          }
          i++;
        }
      };
      if(Datas[k].text){
        if(Datas[k].text.indexOf(":")==-1) var Write = 1;
        else var Write = 2;
      };

      var Next = Datas[k].next;

      function Text_write(){
        while(Datas[k].text[i]==" ") i++;
        if(Datas[k].text[i]==":") Write = 2;
        Text[i]._element.textContent = Datas[k].text[i];
        i++;
        if(Datas[k].text[i]==undefined){
          if(Datas[k].選択肢) Write = "選択肢";
          else Write = false;
        }
        if(Write==2) Text_write();
        return;
      }

      i = 0;
      var C_N = null;

      while(Write){
        if(Write){
          if(Write=="選択肢"){
            Key_c = false;
            i = Image.length;
            for(var j = 0; j < Object.keys(Datas[k].選択肢).length; j++){
              ChoiceText[j]._element.textContent = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j]].text;
              ChoiceText[j].Number = j;
              ChoiceText[j].opacity = 1;
              ChoiceText[j].選択 = false;
              Image[Images_Data["選択肢"+j]].Number = j;
              Image[Images_Data["選択肢"+j]].next = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j]].next;
              Image[Images_Data["選択肢"+j]].text = ChoiceText[j]._element.textContent;
              Image[Images_Data["選択肢"+j]].opacity = 0.5;
            }
            ChoiceText[j-1].選択 = true;
            ChoiceText[j-1]._element.textContent = "▶ " + ChoiceText[j-1]._element.textContent;
            Next = Datas[k].選択肢[Object.keys(Datas[k].選択肢)[j-1]].next;
            C_N = j-1;
            Write = false;
          }
          else Text_write();
        };
      };

      for(var j = 0; j < 5; j++){
        Image[Images_Data["選択肢"+j]].addEventListener("touchend",function(e){
          if(this.opacity) Choice_Choice(this);
          return;
        });
        ChoiceText[j].addEventListener("touchend",function(e){
          if(this.opacity) Choice_Choice(Image[Images_Data["選択肢"+this.Number]]);
          return;
        });
      };

      function Choice_Choice(image){
        if(ChoiceText[image.Number].選択){
          for(var a = 0; a < 5; a++){
            ChoiceText[a].opacity = 0;
            Image[Images_Data["選択肢"+a]].opacity = 0;
          }
        }
        else{
          for(var a = 0; a < 5; a++){
            ChoiceText[a].選択 = false;
            ChoiceText[a]._element.textContent = Image[Images_Data["選択肢"+a]].text;
          }
          C_N = image.Number;
          Next = image.next;
          ChoiceText[image.Number].選択 = true;
          ChoiceText[image.Number]._element.textContent = "▶ " + image.text;
        }
      };

      return scene;
    };
    Datas = {
      image:{
        1:{name:"証人席"},
        2:{name:"ガキ"},
        3:{name:"証言台"}
      },
      1:{
        text:"アクムー:●まあ、そこはアクムーちゃんは●アクムー様だから。",
        image:{
          1:{
            name:"ガキ",
            src:"ガキ.png",
            width:1600,
            height:900,
            x:0,
            y:0
          },
          2:{
            name:"証人席",
            src:"証人席.png",
            width:1600,
            height:900,
            x:0,
            y:0
          },
          3:{
            name:"証言台",
            src:"証言台.png",
            width:1600,
            height:900,
            x:0,
            y:0
          }
        },
        選択肢:{3:{text:"そうなんだ。"},2:{text:"すごーい！"},1:{text:"えもい！"}}
      }
    };
    game.replaceScene(Chat_Scene(Datas));
    return;
  };
  game.start();
};
