import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// učitavanje podataka iz fajlova
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const putanjaDoFajlaGrupe = path.join(__dirname, 'groups.json');
const putanjaDoFajlaPrijateljske = path.join(__dirname, 'exibitions.json');

let sveGrupe = JSON.parse(fs.readFileSync(putanjaDoFajlaGrupe,'utf8'));
const prijateljskeUtakmice = JSON.parse(fs.readFileSync(putanjaDoFajlaPrijateljske, 'utf-8'));

// kreiranje početnih tabela grupa
let grupaA = sveGrupe.A;
let grupaB = sveGrupe.B;
let grupaC = sveGrupe.C;

// prilagođavanje objekata za prikazivanje tabele i simuliranje utakmica
grupaA.forEach(obj => {
    obj.forma = 5;
    obj.pobede = 0;
    obj.porazi = 0;
    obj.bodovi = 0;
    obj.postignutiKoševi = 0;
    obj.primljeniKoševi = 0;
    obj.međusobniSkorBodovi = 0;
    obj.međusobniSkorRazlika = 0;
});

grupaB.forEach(obj => {
    obj.forma = 5;
    obj.pobede = 0;
    obj.porazi = 0;
    obj.bodovi = 0;
    obj.postignutiKoševi = 0;
    obj.primljeniKoševi = 0;
    obj.međusobniSkorBodovi = 0;
    obj.međusobniSkorRazlika = 0;
});

grupaC.forEach(obj => {
    obj.forma = 5;
    obj.pobede = 0;
    obj.porazi = 0;
    obj.bodovi = 0;
    obj.postignutiKoševi = 0;
    obj.primljeniKoševi = 0;
    obj.međusobniSkorBodovi = 0;
    obj.međusobniSkorRazlika = 0;
});

// prilagođavanje forme ekipa na osnovu prijateljskih utakmica
// ulazni parametri => grupa: [object] (niz objekata grupe A,B i C); tim: string (ISOString timova iz fajla exibitions.json)
const prilagođavanjeForme = (grupa,tim) => {
    grupa.forEach((timGrupe)=>{ 
        if(tim === timGrupe.ISOCode){
            prijateljskeUtakmice[tim].forEach((utakmica)=>{
                const [rez1,rez2] = utakmica.Result.split('-');
                const rezA = Number(rez1);
                const rezB = Number(rez2);
    
                if(rezA > rezB){
                    timGrupe.forma += 1;
                }else{
                    timGrupe.forma -= 1;
                };
            });
        };
    });
};

Object.keys(prijateljskeUtakmice).forEach((tim)=> {
    prilagođavanjeForme(grupaA,tim);
    prilagođavanjeForme(grupaB,tim);
    prilagođavanjeForme(grupaC,tim);
});

// objekat za evidenciju svih utakmica na turniru
const sveUtakmiceTurnira = {};

// funkcija simulirajUtakmicu simulira utakmicu na osnovu faktora koji utiču na rezultat (rang tima na fiba listi, forma ekipe i nasumični faktor)
// ulazni parametri   => timA: object; timB: object (objekat timova iz niza grupe)
// izlazni parametri  => timA,TimB: object; ukupnoPoenaA,ukupnoPoenaB: number (objekat timova koji su igrali i rezultat utakmice)
const simulirajUtakmicu = (timA,timB) => {
    const { Team: imeTimaA, FIBARanking: rangA, forma: formaA } = timA;
    const { Team: imeTimaB, FIBARanking: rangB, forma: formaB } = timB;

    // početna vrednost poena
    let ukupnoPoenaA = 75;
    let ukupnoPoenaB = 75;

    // funkcija formaUPoene dodaje poene na osnovu forme tima minimum 0 maximum 10
    // ulazni parametri => formaTima: number; timA: boolean
    const formaUPoene = (formaTima,timA) => {
        switch (formaTima) {
            case 10:
                timA ? ukupnoPoenaA +=5 : ukupnoPoenaB +=5;
                break;
            case 9:
                timA ? ukupnoPoenaA +=4 : ukupnoPoenaB +=4;
                break;
            case 8:
                timA ? ukupnoPoenaA +=3 : ukupnoPoenaB +=3;
                break;
            case 7:
                timA ? ukupnoPoenaA +=2 : ukupnoPoenaB +=2;
                break;
            case 6:
                timA ? ukupnoPoenaA +=1 : ukupnoPoenaB +=1;
                break;
            case 5:
                timA ? ukupnoPoenaA +=0 : ukupnoPoenaB +=0;
                break;  
            case 4:
                timA ? ukupnoPoenaA -=1 : ukupnoPoenaB -=1;
                break;
            case 3:
                timA ? ukupnoPoenaA -=2 : ukupnoPoenaB -=2;
                break;
            case 2:
                timA ? ukupnoPoenaA -=3 : ukupnoPoenaB -=3;
                break;
            case 1:
                timA ? ukupnoPoenaA -=4 : ukupnoPoenaB -=4;
                break;  
            default:
                break;
        };
    };
    formaUPoene(formaA,true);
    formaUPoene(formaB,false);

    // funkcija rangUPoene dodaje poene na osnovu ranga tima
    // ulazni parametri => rangTima: number; timA: boolean
    const rangUPoene = (rangTima,timA) => {
        if(rangTima === 1){
            timA ? ukupnoPoenaA +=16 : ukupnoPoenaB +=16;
        }else if(rangTima >= 2 && rangTima < 5){
            timA ? ukupnoPoenaA += 10 : ukupnoPoenaB += 10;
        }else if(rangTima >= 5 && rangTima < 10){
            timA ? ukupnoPoenaA += 8 : ukupnoPoenaB += 8;
        }else if(rangTima >= 10 && rangTima < 15){
            timA ? ukupnoPoenaA += 6 : ukupnoPoenaB += 6;
        }else if(rangTima >= 15 && rangTima < 20){
            timA ? ukupnoPoenaA += 4 : ukupnoPoenaB += 4;
        }else if(rangTima >= 20 && rangTima < 25){
            timA ? ukupnoPoenaA += 2 : ukupnoPoenaB += 2;
        }else if(rangTima >= 25 && rangTima < 30){
            timA ? ukupnoPoenaA += 0 : ukupnoPoenaB += 0;
        }else if(rangTima >= 30 && rangTima < 35){
            timA ? ukupnoPoenaA -= 2 : ukupnoPoenaB -= 2;
        }else if(rangTima >= 35 && rangTima < 40){
            timA ? ukupnoPoenaA -= 4 : ukupnoPoenaB -= 4;
        }else if(rangTima >= 40){
            timA ? ukupnoPoenaA -= 6 : ukupnoPoenaB -= 6;
        };
    };
    rangUPoene(rangA,true);
    rangUPoene(rangB,false);

    // funkcija randomFaktor dodaje poene u rasponu od -15 do +15
    // ulazni parametri => timA: boolean
    const randomFaktor = (timA) => {
        const randomPoeni = Math.floor(Math.random() * 31) - 15;
        timA ? ukupnoPoenaA += randomPoeni : ukupnoPoenaB += randomPoeni;
    };
    randomFaktor(true);
    randomFaktor(false);

    // produžetak
    let brojProdužetaka = 0;
    while (ukupnoPoenaA === ukupnoPoenaB) {
        let min = 4;
        let max = 20;

        brojProdužetaka++;
        ukupnoPoenaA += Math.floor(Math.random() * (max - min + 1)) + min;
        ukupnoPoenaB += Math.floor(Math.random() * (max - min + 1)) + min;

        // provera da li je rezultat nerešen posle produžetka
        if (ukupnoPoenaA !== ukupnoPoenaB) {
            // prikaz rezultata utakmice
            console.log(`           ${imeTimaA} - ${imeTimaB} (${ukupnoPoenaA}:${ukupnoPoenaB}) ${brojProdužetaka === 1 ? "p" : `${brojProdužetaka}p`}`);  
            // upisivanje rezultata utakmice
            upisivanjeUtakmice(timA,timB,ukupnoPoenaA,ukupnoPoenaB);
        };
    };

    // nema produžetka
    if (ukupnoPoenaA !== ukupnoPoenaB && brojProdužetaka === 0) {
        // prikaz rezultata utakmice
        console.log(`           ${imeTimaA} - ${imeTimaB} (${ukupnoPoenaA}:${ukupnoPoenaB})`);  
        // upisivanje rezultata utakmice
        upisivanjeUtakmice(timA,timB,ukupnoPoenaA, ukupnoPoenaB);
    };

    // dodavanje forme ekipe na osnovu rezultata
    if(ukupnoPoenaA > ukupnoPoenaB){
        if (timA.forma >= 10){
            timA.forma = 10;
            timB.forma -= 1;
        }else {
            timA.forma += 1;
            timB.forma -= 1;
        };
    }else {
        if (timB.forma >= 10){
            timB.forma = 10;
            timA.forma -= 1;
        }else {
            timB.forma += 1;
            timA.forma -= 1;
        };
    };

    return [timA,timB,ukupnoPoenaA,ukupnoPoenaB];
};

// funkcija upisivanjeUtakmice upisuje rezultat i dodeljuje timovima odgovarajuće parametre za računanje tabele
// ulazni parametri => tim1: object; tim2:object; poeni1: number; poeni2:number;
function upisivanjeUtakmice(tim1, tim2, poeni1, poeni2) {
    // ažuriranje timova
    if (poeni1 > poeni2) {
        tim1.bodovi += 2;
        tim1.pobede += 1;
        tim1.postignutiKoševi += poeni1;
        tim1.primljeniKoševi += poeni2;
        tim2.bodovi += 1;
        tim2.porazi += 1;     
        tim2.postignutiKoševi += poeni2;
        tim2.primljeniKoševi += poeni1;
    } else if (poeni1 < poeni2) {
        tim2.bodovi += 2;
        tim2.pobede += 1;
        tim2.postignutiKoševi += poeni2;
        tim2.primljeniKoševi += poeni1;
        tim1.bodovi += 1;
        tim1.porazi += 1;
        tim1.postignutiKoševi += poeni1; 
        tim1.primljeniKoševi += poeni2;
    };

    sveUtakmiceTurnira[tim1.Team + ' vs ' + tim2.Team] = { poeni1, poeni2 };
};

// funkcija rasporediUtakmice raspoređuje utakmice iz iste grupe po kolima
// ulazni parametri => groups: { imeGrupe:string, sveGrupe:[object] } (objekat koji dobijamo iz fajla groups.json)
// izlazni parametri => faze: { imeGrupe: string, utakmice [{object}] }
const rasporediUtakmice = (sveGrupe) => {
    const faze = {
        kolo1: [],
        kolo2: [],
        kolo3: []
    };

    Object.keys(sveGrupe).forEach(imeGrupe => {
        const timoviGrupe = sveGrupe[imeGrupe];
        
        if (timoviGrupe.length !== 4) {
            throw new Error(`Grupa ${imeGrupe} mora imati tačno 4 karaktera.`);
        };

        const utakmiceIzGrupe = [];
        // generisanje svih utakmica u grupi
        for (let i = 0; i < timoviGrupe.length; i++) {
            for (let j = i + 1; j < timoviGrupe.length; j++) {         
                utakmiceIzGrupe.push([timoviGrupe[i], timoviGrupe[j]]);
            };
        };

        // podela utakmica iz grupe po kolima
        faze['kolo1'].push({ imeGrupe: imeGrupe, utakmice: [utakmiceIzGrupe[0], utakmiceIzGrupe[5]] });
        faze['kolo2'].push({ imeGrupe: imeGrupe, utakmice: [utakmiceIzGrupe[1], utakmiceIzGrupe[4]] });
        faze['kolo3'].push({ imeGrupe: imeGrupe, utakmice: [utakmiceIzGrupe[2], utakmiceIzGrupe[3]] });
    });

    return faze;
};

const grupnaFaza = rasporediUtakmice(sveGrupe);

// prikaz i simulacija svih utakmica iz grupe podeljenih po kolima
Object.keys(grupnaFaza).forEach((kolo,index) => {
    console.log(`   Grupna faza ${index+1} ${kolo.slice(0, -1)}:`);

    grupnaFaza[kolo].forEach(grupa => {
        console.log(`       Grupa ${grupa.imeGrupe}`);

        grupa.utakmice.forEach(match => {
            simulirajUtakmicu(match[0],match[1]);
        });
    });

    console.log('');
    console.log("-----------------------------------------------------------------------------------------------------------------------");
});

// funkcija računa poene i koš razliku u međusobnom skoru i upisuje u objekte timova
// ulazni parametar => timoviJednakihBodova: [object] 
const izračunajMeđusobniSkor = (timoviJednakihBodova) => {
    timoviJednakihBodova.forEach(tim => {
        timoviJednakihBodova.forEach(protivnik => {
            if (tim.Team !== protivnik.Team) {
                const ključ = tim.Team + ' vs ' + protivnik.Team;
                
                if (sveUtakmiceTurnira[ključ]) {
                    const { poeni1, poeni2 } = sveUtakmiceTurnira[ključ];
                    
                    if (poeni1 > poeni2) {
                        tim.međusobniSkorBodovi += 2;
                        protivnik.međusobniSkorBodovi += 1;
                    } else if (poeni1 < poeni2) {
                        protivnik.međusobniSkorBodovi += 2;
                        tim.međusobniSkorBodovi += 1;
                    };
                    
                    tim.međusobniSkorRazlika += (poeni1 - poeni2);
                    protivnik.međusobniSkorRazlika += (poeni2 - poeni1);
                };
            };
        });
    });
};

// grupiši timove sa istim brojem bodova grupa A
const timoviGrupisaniPoBodovimaA = grupaA.reduce((grupisaniTimovi, tim) => {
    if (!grupisaniTimovi[tim.bodovi]) {
        grupisaniTimovi[tim.bodovi] = [];
    };
    grupisaniTimovi[tim.bodovi].push(tim);
    return grupisaniTimovi;
}, {});

// Izračunaj međusobni skor za timove sa istim brojem bodova grupa A
Object.keys(timoviGrupisaniPoBodovimaA).forEach(bodovi => {
    const timoviJednakihBodova = timoviGrupisaniPoBodovimaA[bodovi];
    if (timoviJednakihBodova.length > 1) {
        izračunajMeđusobniSkor(timoviJednakihBodova);
    };
});

// grupiši timove sa istim brojem bodova grupa B
const timoviGrupisaniPoBodovimaB = grupaB.reduce((grupisaniTimovi, tim) => {
    if (!grupisaniTimovi[tim.bodovi]) {
        grupisaniTimovi[tim.bodovi] = [];
    };
    grupisaniTimovi[tim.bodovi].push(tim);
    return grupisaniTimovi;
}, {});

// Izračunaj međusobni skor za timove sa istim brojem bodova grupa B
Object.keys(timoviGrupisaniPoBodovimaB).forEach(bodovi => {
    const timoviJednakihBodova = timoviGrupisaniPoBodovimaB[bodovi];
    if (timoviJednakihBodova.length > 1) {
        izračunajMeđusobniSkor(timoviJednakihBodova);
    };
});

// grupiši timove sa istim brojem bodova grupa C
const timoviGrupisaniPoBodovimaC = grupaC.reduce((grupisaniTimovi, tim) => {
    if (!grupisaniTimovi[tim.bodovi]) {
        grupisaniTimovi[tim.bodovi] = [];
    };
    grupisaniTimovi[tim.bodovi].push(tim);
    return grupisaniTimovi;
}, {});

// Izračunaj međusobni skor za timove sa istim brojem bodova grupa C
Object.keys(timoviGrupisaniPoBodovimaC).forEach(bodovi => {
    const timoviJednakihBodova = timoviGrupisaniPoBodovimaC[bodovi];
    if (timoviJednakihBodova.length > 1) {
        izračunajMeđusobniSkor(timoviJednakihBodova);
    };
});

// funkcija sortiranjeGrupa sortira sve timove iz grupe, formira i prikazuje tabele grupne faze
const sortiranjeGrupa = () => {
    grupaA.sort((a, b) => {
        // sortiranje po bodovima (silazno)
        if (a.bodovi !== b.bodovi) {
            return b.bodovi - a.bodovi;
        };
        
        // sortiranje po međusobnim bodovima (silazno)
        if (a.međusobniSkorBodovi !== b.međusobniSkorBodovi) {
            return b.međusobniSkorBodovi - a.međusobniSkorBodovi;
        };
        
        // sortiranje po međusobnoj koš razlici (silazno)
        if (a.međusobniSkorRazlika != b.međusobniSkorRazlika) {
            return b.međusobniSkorRazlika - a.međusobniSkorRazlika;
        };
    
        // sortiranje po FIBA rang listi
        return a.FIBARanking - b.FIBARanking;
    });

    grupaB.sort((a, b) => {
        // sortiranje po bodovima (silazno)
        if (a.bodovi !== b.bodovi) {
            return b.bodovi - a.bodovi;
        };
        
        // sortiranje po međusobnim bodovima (silazno)
        if (a.međusobniSkorBodovi !== b.međusobniSkorBodovi) {
            return b.međusobniSkorBodovi - a.međusobniSkorBodovi;
        };
        
        // sortiranje po međusobnoj koš razlici (silazno)
        if (a.međusobniSkorRazlika != b.međusobniSkorRazlika) {
            return b.međusobniSkorRazlika - a.međusobniSkorRazlika;
        };

        // sortiranje po FIBA rang listi
        return a.FIBARanking - b.FIBARanking;
    });

    grupaC.sort((a, b) => {
        // sortiranje po bodovima (silazno)
        if (a.bodovi !== b.bodovi) {
            return b.bodovi - a.bodovi;
        };
        
        // sortiranje po međusobnim bodovima (silazno)
        if (a.međusobniSkorBodovi !== b.međusobniSkorBodovi) {
            return b.međusobniSkorBodovi - a.međusobniSkorBodovi;
        };
        
        // sortiranje po međusobnoj koš razlici (silazno)
        if (a.međusobniSkorRazlika != b.međusobniSkorRazlika) {
            return b.međusobniSkorRazlika - a.međusobniSkorRazlika;
        };
        
        // sortiranje po FIBA rang listi
        return a.FIBARanking - b.FIBARanking;
    });
    
    // dodavanje pozicije timova za svaku tabelu
    grupaA = grupaA.map((tim, index) => ({
        ...tim,
        pozicija: index+1
    }));

    grupaB = grupaB.map((tim, index) => ({
        ...tim,
        pozicija: index+1
    }));

    grupaC = grupaC.map((tim, index) => ({
        ...tim,
        pozicija: index+1
    }));

    // prikaz tabela grupne faze
    console.log("   Grupna faza tabele:");
    console.log("");
    console.log("Grupa A |   Ime Tima  | Odigrali | Pobede | Porazi | Bodovi | Koševi + | Koševi - | Koš razlika | MS Bodovi | MS razlika");
    console.log("------------------------------------------------------------------------------------------------------------------------");
    grupaA.forEach(tim => {
      console.log(`      ${tim.pozicija} | ${tim.Team.padEnd(12)}|    ${tim.pobede + tim.porazi}     |    ${tim.pobede}   |   ${tim.porazi}    |    ${tim.bodovi}   |   ${tim.postignutiKoševi}    |   ${tim.primljeniKoševi}    |     ${`${tim.postignutiKoševi - tim.primljeniKoševi}`.padEnd(3)}     |      ${tim.međusobniSkorBodovi}    |    ${tim.međusobniSkorRazlika}`);
    });
    console.log("");
    console.log("Grupa B |   Ime Tima  | Odigrali | Pobede | Porazi | Bodovi | Koševi + | Koševi - | Koš razlika | MS Bodovi | MS razlika");
    console.log("------------------------------------------------------------------------------------------------------------------------");
    grupaB.forEach(tim => {
      console.log(`      ${tim.pozicija} | ${`${tim.Team.padEnd(12)}`}|    ${tim.pobede + tim.porazi}     |    ${tim.pobede}   |   ${tim.porazi}    |    ${tim.bodovi}   |   ${tim.postignutiKoševi}    |   ${tim.primljeniKoševi}    |     ${`${tim.postignutiKoševi - tim.primljeniKoševi}`.padEnd(3)}     |      ${tim.međusobniSkorBodovi}    |    ${tim.međusobniSkorRazlika}`);
    });
    console.log("");
    console.log("Grupa C |  Ime Tima   | Odigrali | Pobede | Porazi | Bodovi | Koševi + | Koševi - | Koš razlika | MS Bodovi | MS razlika");
    console.log("------------------------------------------------------------------------------------------------------------------------");
    grupaC.forEach(tim => {
      console.log(`      ${tim.pozicija} | ${(tim.Team ==='Sjedinjene Države') ? `${'SAD'.padEnd(12)}` : `${tim.Team.padEnd(12)}`}|    ${tim.pobede + tim.porazi}     |    ${tim.pobede}   |   ${tim.porazi}    |    ${tim.bodovi}   |   ${tim.postignutiKoševi}    |   ${tim.primljeniKoševi}    |     ${`${tim.postignutiKoševi - tim.primljeniKoševi}`.padEnd(3)}     |      ${tim.međusobniSkorBodovi}    |    ${tim.međusobniSkorRazlika}`);
    });
    console.log("");
    console.log("------------------------------------------------------------------------------------------------------------------------");
};

sortiranjeGrupa();

// funkcija rangiranje sortira timove iz sve tri grupe i prikazuje rang tabelu
const rangiranje = (tabelaA,tabelaB,tabelaC) => {
    const rangiranjeA = [];
    const rangiranjeB = [];
    const rangiranjeC = [];

    rangiranjeA.push(tabelaA[0],tabelaB[0],tabelaC[0]);
    rangiranjeB.push(tabelaA[1],tabelaB[1],tabelaC[1]);
    rangiranjeC.push(tabelaA[2],tabelaB[2],tabelaC[2]);

    const izračunajRang = (rangiranje) => {
        rangiranje.sort((a, b) => {
            // sortiranje po bodovima (silazno)
            if (a.bodovi !== b.bodovi) {
                return b.bodovi - a.bodovi;
            };
            
            // sortiranje po koš razlici (silazno)
            if ((a.postignutiKoševi - a.primljeniKoševi) !== (b.postignutiKoševi - b.primljeniKoševi)) {
                return (b.postignutiKoševi - b.primljeniKoševi) - (a.postignutiKoševi - a.primljeniKoševi);
            };
            
            // sortiranje po broju postignutih koševa (silazno)
            if (a.postignutiKoševi != b.postignutiKoševi) {
                return b.postignutiKoševi - a.postignutiKoševi;
            };

            // sortiranje po FIBA rang listi
            return a.FIBARanking - b.FIBARanking;
        });
    }
    izračunajRang(rangiranjeA);
    izračunajRang(rangiranjeB);
    izračunajRang(rangiranjeC);
    
    let konačanRang = [...rangiranjeA, ...rangiranjeB, ...rangiranjeC];

    konačanRang.pop();
    konačanRang.map((tim,index)=>{
        tim.rang = index+1;
    });

    console.log("");
    console.log("   Rang ekipa nakon grupne faze:");
    console.log("");
    console.log("   Rang |       Ime tima         | Bodovi | Koš razlika | Koševi + | Pozicija | FIBA rang lista");
    console.log("-----------------------------------------------------------------------------------------------");
    konačanRang.forEach((tim)=>{
        console.log(`      ${tim.rang} |    ${tim.Team.padEnd(20)}|    ${tim.bodovi}   |     ${`${tim.postignutiKoševi - tim.primljeniKoševi}`.padEnd(3)}     |   ${tim.postignutiKoševi}    |    ${tim.pozicija}     |      ${tim.FIBARanking}`);
    })
    console.log("");
    console.log("------------------------------------------------------------------------------------------------------------------------");

    return konačanRang;
};

const timoviEliminacioneFaze = rangiranje(grupaA,grupaB,grupaC);

const utakmiceČetvrtfinala = [];

// funkcija žreb raspoređuje timove po šeširima, ukršta šešire i formira parove četvrtfinala i polufinala
// ulazni parametar => [object] (niz objekata timova, prethodno sortiranih)
const žreb = (timoviEliminacioneFaze) => {
    const šeširD = {imeŠešira: 'Šešir D',tim1: timoviEliminacioneFaze[0].Team, tim2: timoviEliminacioneFaze[1].Team};
    const šeširE = {imeŠešira: 'Šešir E',tim1: timoviEliminacioneFaze[2].Team, tim2: timoviEliminacioneFaze[3].Team};
    const šeširF = {imeŠešira: 'Šešir F',tim1: timoviEliminacioneFaze[4].Team, tim2: timoviEliminacioneFaze[5].Team};
    const šeširG = {imeŠešira: 'Šešir G',tim1: timoviEliminacioneFaze[6].Team, tim2: timoviEliminacioneFaze[7].Team};

    const sviŠeširi = [šeširD,šeširE,šeširF,šeširG];
    
    // prikaži sve Šešire
    console.log("");
    console.log("       Šeširi:");
    sviŠeširi.forEach((tim)=>{
        console.log(`           ${tim.imeŠešira}`);
        console.log(`               ${tim.tim1}`);
        console.log(`               ${tim.tim2}`);
    });
    console.log("");
    
    // funkcija proveriUtakmiceČetvrtfinala proverava da li su se timovi prethodno susretali
    const proveriUtakmiceČetvrtfinala = (utakmicaČetvrtfinala) => {
        let pomoćniNiz = [];

        Object.keys(sveUtakmiceTurnira).forEach((utakmica) => {
            if(utakmica === utakmicaČetvrtfinala){
                pomoćniNiz.push("vec odigrano");
            };
        });

        return pomoćniNiz.length > 0 ? false : true;
    };
    
    // funkcija ukrstiŠešire formira parove četvrtfinala i polufinala na osnovu nasumičnog faktora i prikzuje ih
    const ukrstiŠešire =() => {
        let utakmica1,utakmica2,utakmica3,utakmica4;
            // žreb parova četvrtfinala
            const randomFaktor = Math.round(Math.random());

            if (randomFaktor === 0 ){
                if(proveriUtakmiceČetvrtfinala(`${šeširD.tim1} vs ${šeširG.tim1}`) && proveriUtakmiceČetvrtfinala(`${šeširD.tim2} vs ${šeširG.tim2}`)){
                    utakmica1 = `${šeširD.tim1} vs ${šeširG.tim1}`;
                    utakmica2 = `${šeširD.tim2} vs ${šeširG.tim2}`;
                }else{
                    utakmica1 = `${šeširD.tim1} vs ${šeširG.tim2}`;
                    utakmica2 = `${šeširD.tim2} vs ${šeširG.tim1}`;
                };
            }else if (randomFaktor === 1){
                if(proveriUtakmiceČetvrtfinala(`${šeširD.tim1} vs ${šeširG.tim2}`) && proveriUtakmiceČetvrtfinala(`${šeširD.tim2} vs ${šeširG.tim1}`)){
                    utakmica1 = `${šeširD.tim1} vs ${šeširG.tim2}`;
                    utakmica2 = `${šeširD.tim2} vs ${šeširG.tim1}`;
                }else{
                    utakmica1 = `${šeširD.tim1} vs ${šeširG.tim1}`;
                    utakmica2 = `${šeširD.tim2} vs ${šeširG.tim2}`;
                };
            };

            const randomFaktor2 = Math.round(Math.random());

            if (randomFaktor2 === 0 ){
                if(proveriUtakmiceČetvrtfinala(`${šeširE.tim1} vs ${šeširF.tim1}`) && proveriUtakmiceČetvrtfinala(`${šeširE.tim2} vs ${šeširF.tim2}`)){
                    utakmica3 = `${šeširE.tim1} vs ${šeširF.tim1}`;
                    utakmica4 = `${šeširE.tim2} vs ${šeširF.tim2}`;
                }else{
                    utakmica3 = `${šeširE.tim1} vs ${šeširF.tim2}`;
                    utakmica4 = `${šeširE.tim2} vs ${šeširF.tim1}`;
                };
            }else if (randomFaktor2 === 1){
                if(proveriUtakmiceČetvrtfinala(`${šeširE.tim1} vs ${šeširF.tim2}`) && proveriUtakmiceČetvrtfinala(`${šeširE.tim2} vs ${šeširF.tim1}`)){
                    utakmica3 = `${šeširE.tim1} vs ${šeširF.tim2}`;
                    utakmica4 = `${šeširE.tim2} vs ${šeširF.tim1}`;
                }else{
                    utakmica3 = `${šeširE.tim1} vs ${šeširF.tim1}`;
                    utakmica4 = `${šeširE.tim2} vs ${šeširF.tim2}`;
                };
            };
            // žreb parova polufinala
            const randomFaktor3 = Math.round(Math.random());
            
            if(randomFaktor3 === 0){
                utakmiceČetvrtfinala.push(utakmica1);
                utakmiceČetvrtfinala.push(utakmica3);
                utakmiceČetvrtfinala.push(utakmica2);
                utakmiceČetvrtfinala.push(utakmica4);
            }else if(randomFaktor3 === 1){
                utakmiceČetvrtfinala.push(utakmica1);
                utakmiceČetvrtfinala.push(utakmica4);
                utakmiceČetvrtfinala.push(utakmica2);
                utakmiceČetvrtfinala.push(utakmica3);
            } ;

            console.log("       Eliminaciona Faza:");
            console.log(`           ${utakmiceČetvrtfinala[0]}`);
            console.log(`           ${utakmiceČetvrtfinala[1]}`);
            console.log("")
            console.log(`           ${utakmiceČetvrtfinala[2]}`);
            console.log(`           ${utakmiceČetvrtfinala[3]}`);
            console.log("");
            console.log("-----------------------------------------------------------------------------------");
            
    };
    ukrstiŠešire();
};

žreb(timoviEliminacioneFaze);

const eliminacionaFaza = (timovi,utakmice) =>{
    // prikaz četvrtfinale
    let četvrfinale = [];

    console.log("");
    console.log("       Četvrfinale:");

    utakmice.forEach((utakmice) => {
        const [tim1, tim2] = utakmice.split(' vs ');
        let timA,timB;
       
        timovi.forEach((tim)=>{
            if(tim.Team === tim1){
                timA = tim;
                timovi.forEach((x)=>{
                    if(x.Team === tim2){
                        timB = x;
                    };
                });
            };
        });

        const utakmicaČetvrtfinala = simulirajUtakmicu(timA,timB);
        
        četvrfinale.push(utakmicaČetvrtfinala);
    });

    const utakmica1 = četvrfinale[0];
    const utakmica2 = četvrfinale[1];
    const utakmica3 = četvrfinale[2];
    const utakmica4 = četvrfinale[3];
    // prikaz polufinale
    const polufinale1 = [];
    const polufinale2 = [];

    if(utakmica1[2]>utakmica1[3]){
        polufinale1.push(utakmica1[0]);
    }else{
        polufinale1.push(utakmica1[1]);
    };

    if(utakmica2[2]>utakmica2[3]){
        polufinale1.push(utakmica2[0]);
    }else{
        polufinale1.push(utakmica2[1]);
    };

    if(utakmica3[2]>utakmica3[3]){
        polufinale2.push(utakmica3[0]);
    }else{
        polufinale2.push(utakmica3[1]);
    };

    if(utakmica4[2] > utakmica4[3]){
        polufinale2.push(utakmica4[0]);
    }else{
        polufinale2.push(utakmica4[1]);
    };
    
    console.log("");
    console.log("       Polufinale:");
    const polufinaleA = simulirajUtakmicu(polufinale1[0],polufinale1[1]);
    const polufinaleB = simulirajUtakmicu(polufinale2[0],polufinale2[1]);
    console.log("");
    console.log("");

    // prikaz finale i utakmica za treće mesto
    const finale = [];
    const utakmicaZaTrećeMesto = [];

    if(polufinaleA[2]>polufinaleA[3]){
        finale.push(polufinaleA[0]);
        utakmicaZaTrećeMesto.push(polufinaleA[1]);
    }else{
        finale.push(polufinaleA[1]);
        utakmicaZaTrećeMesto.push(polufinaleA[0]);
    };

    if(polufinaleB[2]>polufinaleB[3]){
        finale.push(polufinaleB[0]);
        utakmicaZaTrećeMesto.push(polufinaleB[1]);
    }else{
        finale.push(polufinaleB[1]);
        utakmicaZaTrećeMesto.push(polufinaleB[0]);
    };

    console.log("       Utakmica za treće mesto:");
    const rezultatZaTreće = simulirajUtakmicu(utakmicaZaTrećeMesto[0],utakmicaZaTrećeMesto[1]);

    console.log("");
    console.log("       Finale:");
    const rezultatFinale = simulirajUtakmicu(finale[0],finale[1]);

    console.log("");
    console.log("");
    // prikaz medalje
    const medalje = [];

    if(rezultatFinale[2] > rezultatFinale[3]){
        medalje.push(rezultatFinale[0]);
        medalje.push(rezultatFinale[1]);
    }else{
        medalje.push(rezultatFinale[1]);
        medalje.push(rezultatFinale[0]);
    };

    if(rezultatZaTreće[2] > rezultatZaTreće[3]){
        medalje.push(rezultatZaTreće[0]);
    }else{
        medalje.push(rezultatZaTreće[1]);
    };

    console.log("       Medalje:");
    console.log(`       \u{1F3C6}  1. \u{1F947} ${medalje[0].Team.padEnd(10)} `);
    console.log(`           2. \u{1F948} ${medalje[1].Team.padEnd(10)} `);
    console.log(`           3. \u{1F949} ${medalje[2].Team.padEnd(10)} `);
};

eliminacionaFaza(timoviEliminacioneFaze, utakmiceČetvrtfinala);


