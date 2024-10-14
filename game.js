//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.
// Turkce olarak, ÖNEMLI: Bu oyun için HTML dosyasına doğru script etiketini ekleyerek Kaboom sürüm 0.5.0'ı kullanmaktan emin olun.

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 1, 1],
});

// Bu kisima kadar yaptiklarimizi aciklayalim:
// 1. Kaboom fonksiyonu ile oyunumuzu baslattik ve bazi ayarlar yaptik.
// 2. Oyunumuzun genelini kapsayacak olan global: true ayarini verdik.
// 3. Oyunun tam ekran olmasini saglayan fullscreen: true ayarini verdik.
// 4. Oyunun ölçeklendirilmesini sağlayan scale: 1 ayarını verdik.
// 5. Oyunun hata ayıklama modunu açan debug: true ayarını verdik.
// 6. Oyunun arka plan rengini belirleyen clearColor: [0, 0, 1, 1] ayarını verdik. Bu ayar, oyunun arka plan rengini mavi olarak ayarlar.

// Speeds
const MOVE_SPEED = 120;
const SLICER_SPEED = 100;
const SKELETOR_SPEED = 60;

// Bu kisima kadar yaptiklarimizi aciklayalim:
// 1. MOVE_SPEED adında bir sabit oluşturduk ve değerini 120 olarak ayarladık. Bu sabit, karakterin hareket hızını belirler.
// 2. SLICER_SPEED adında bir sabit oluşturduk ve değerini 100 olarak ayarladık. Bu sabit, dilimleyicinin hareket hızını belirler.
// 3. SKELETOR_SPEED adında bir sabit oluşturduk ve değerini 60 olarak ayarladık. Bu sabit, iskeletin hareket hızını belirler.

// Game Logic
loadSprite("link-going-left", "assets/img/1Xq9biB.png");
loadSprite("link-going-right", "assets/img/yZIb8O2.png");
loadSprite("link-going-down", "assets/img/tVtlP6y.png");
loadSprite("link-going-up", "assets/img/UkV0we0.png");
loadSprite("left-wall", "assets/img/rfDoaa1.png");
loadSprite("top-wall", "assets/img/QA257Bj.png");
loadSprite("bottom-wall", "assets/img/vWJWmvb.png");
loadSprite("right-wall", "assets/img/SmHhgUn.png");
loadSprite("bottom-left-wall", "assets/img/awnTfNC.png");
loadSprite("bottom-right-wall", "assets/img/84oyTFy.png");
loadSprite("top-left-wall", "assets/img/xlpUxIm.png");
loadSprite("top-right-wall", "assets/img/z0OmBd1.jpg");
loadSprite("top-door", "assets/img/U9nre4n.png");
loadSprite("fire-pot", "assets/img/I7xSp7w.png");
loadSprite("left-door", "assets/img/okdJNls.png");
loadSprite("lanterns", "assets/img/wiSiY09.png");
loadSprite("slicer", "assets/img/c6JFi5Z.png");
loadSprite("skeletor", "assets/img/Ei1VnX8.png");
loadSprite("kaboom", "assets/img/o9WizfI.png");
loadSprite("stairs", "assets/img/VghkL08.png");
loadSprite("bg", "assets/img/u4DVsx6.png");

// Bu kisima kadar yaptiklarimizi aciklayalim:
// 1. loadSprite fonksiyonu ile oyunumuzda kullanacağımız tüm görselleri yükledik.
// 2. loadSprite fonksiyonu, iki parametre alır: Birincisi, görselin adı ve ikincisi, görselin dosya yolu.
// 3. Bu görseller, assets/img klasöründe bulunmaktadır.

scene("game", ({ level, score }) => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
    [
      "ycc)cc^ccw",
      "a        b",
      "a      * b",
      "a    (   b",
      "%        b",
      "a    (   b",
      "a   *    b",
      "a        b",
      "xdd)dd)ddz",
    ],
    [
      "yccccccccw",
      "a        b",
      ")        )",
      "a        b",
      "a        b",
      "a    $   b",
      ")   }    )",
      "a        b",
      "xddddddddz",
    ],
  ];

  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. maps adında bir dizi oluşturduk ve içine iki adet harita ekledik.
  // 2. Haritalar, birer dizi içinde yer alır ve her bir harita, bir oyun seviyesini temsil eder.
  // 3. Haritalar, karakterin hareket edebileceği alanları ve düşmanların yerlerini belirler.

  const levelCfg = {
    width: 48,
    height: 48,
    a: [sprite("left-wall"), solid(), "wall"],
    b: [sprite("right-wall"), solid(), "wall"],
    c: [sprite("top-wall"), solid(), "wall"],
    d: [sprite("bottom-wall"), solid(), "wall"],
    w: [sprite("top-right-wall"), solid(), "wall"],
    x: [sprite("bottom-left-wall"), solid(), "wall"],
    y: [sprite("top-left-wall"), solid(), "wall"],
    z: [sprite("bottom-right-wall"), solid(), "wall"],
    "%": [sprite("left-door"), solid(), "door"],
    "^": [sprite("top-door"), "next-level"],
    $: [sprite("stairs"), "next-level"],
    "*": [sprite("slicer"), "slicer", { dir: -1 }, "dangerous"],
    "}": [sprite("skeletor"), "dangerous", "skeletor", { dir: -1, timer: 0 }],
    ")": [sprite("lanterns"), solid()],
    "(": [sprite("fire-pot"), solid()],
  };

  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. levelCfg adında bir nesne oluşturduk ve içine harita elemanlarını ekledik.
  // 2. Bu elemanlar, haritadaki farklı nesneleri temsil eder ve her bir eleman, bir dizi içinde yer alır.
  // 3. Dizi içindeki ilk eleman yani, sprite, nesnenin görselini belirtir.
  // 4. Dizi içindeki ikinci eleman yani, solid, nesnenin katı olup olmadığını belirtir. Bu demektir ki, karakter bu nesnenin üzerine çıkamaz.
  // 5. Dizi içindeki üçüncü eleman yani, "wall", nesnenin bir duvar olduğunu belirtir.
  // 6. Dizi içindeki dördüncü eleman yani, "slicer", kareterin bu nesneye çarptığında;
  // 7. Dizi içindeki beşinci eleman yani, "dangerous", karakter bu nesneye çarptığında oyunu kaybeder.
  // 8. Dizi içindeki altıncı eleman yani, "skeletor", iskeletin hareket yönünü belirtir.
  // 9. Dizi içindeki yedinci eleman yani, { dir: -1, timer: 0 }, iskeletin hareket yönünü ve zamanlayıcısını belirtir.
  // 10. Dizi içindeki sekizinci eleman yani, "next-level", karakterin

  addLevel(maps[level], levelCfg); // maps[level] ile belirtilen haritayı oluşturur.

  add([sprite("bg"), layer("bg")]); // Arka plan görselini ekler.

  const scoreLabel = add([
    text("0"), 
    pos(400, 450),
    layer("ui"),
    {
      value: score,
    },
    scale(2),
  ]);


  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. scoreLabel adında bir etiket oluşturduk ve içine skoru ekledik.
  // 2. Etiketin konumunu belirledik ve katmanını belirledik.
  // 3. value adında bir özellik oluşturduk ve değerini score olarak ayarladık.
  // 4. Etiketin boyutunu belirledik. scale(2) ile etiketin boyutunu iki katına çıkardık.




  add([text("level " + parseInt(level + 1)), pos(400, 465), scale(2)]); // Seviye etiketini ekler.

  const player = add([
    sprite("link-going-right"),
    pos(5, 190),
    {
      // right by default
      dir: vec2(1, 0),
    },
  ]);


  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. player adında bir karakter oluşturduk ve içine karakterin görselini ekledik.
  // 2. Karakterin konumunu belirledik ve karakterin başlangıç yönünü belirledik.




  player.action(() => {
    player.resolve();
  });


  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. player.action(() => {}) fonksiyonu, karakterin hareketini sağlar.
  // 2. player.resolve() fonksiyonu, karakterin hareketini çözer ve karakterin hareketini sağlar.


  player.overlaps("next-level", () => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value,
    });
  });

  // Bu kisima kadar yaptiklarimizi aciklayalim:
  // 1. player.overlaps("next-level", () => {}) fonksiyonu, karakterin bir sonraki seviyeye geçmesini sağlar.
  // 2. go("game", {}) fonksiyonu, oyunun bir sonraki seviyeye geçmesini sağlar.
  // 3. level: (level + 1) % maps.length, bir sonraki seviyenin belirlenmesini sağlar.
  // 4. score: scoreLabel.value, skorun bir sonraki seviyeye taşınmasını sağlar.
  

  keyDown("left", () => {
    player.changeSprite("link-going-left");
    player.move(-MOVE_SPEED, 0);
    player.dir = vec2(-1, 0);
  });

  keyDown("right", () => {
    player.changeSprite("link-going-right");
    player.move(MOVE_SPEED, 0);
    player.dir = vec2(1, 0);
  });

  keyDown("up", () => {
    player.changeSprite("link-going-up");
    player.move(0, -MOVE_SPEED);
    player.dir = vec2(0, -1);
  });

  keyDown("down", () => {
    player.changeSprite("link-going-down");
    player.move(0, MOVE_SPEED);
    player.dir = vec2(0, 1);
  });

  function spawnKaboom(p) {
    const obj = add([sprite("kaboom"), pos(p), "kaboom"]);
    wait(1, () => {
      destroy(obj);
    });
  }

  keyPress("space", () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)));
  });

  player.collides("door", (d) => {
    destroy(d);
  });

  collides("kaboom", "skeletor", (k, s) => {
    camShake(4);
    wait(1, () => {
      destroy(k);
    });
    destroy(s);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  action("slicer", (s) => {
    s.move(s.dir * SLICER_SPEED, 0);
  });

  collides("slicer", "wall", (s) => {
    s.dir = -s.dir;
  });

  action("skeletor", (s) => {
    s.move(0, s.dir * SKELETOR_SPEED);
    s.timer -= dt();
    if (s.timer <= 0) {
      s.dir = -s.dir;
      s.timer = rand(5);
    }
  });

  collides("skeletor", "wall", (s) => {
    s.dir = -s.dir;
  });

  player.overlaps("dangerous", () => {
    go("lose", { score: scoreLabel.value });
  });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

start("game", { level: 0, score: 0 });
