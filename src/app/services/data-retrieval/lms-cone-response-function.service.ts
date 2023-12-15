import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


export interface GraphLine {
  data: [number, number][];
  color: string;
  name: string;
}

export type LmsConeResponseFunction = (wavelength: number) =>
  {
    L: number,
    M: number,
    S: number
  };

// Based on: https://cie.co.at/datatable/cie-2006-lms-cone-fundamentals-2-field-size-terms-energy
export const cmiLmsConeResponseLut: { [wavelength: number]: { L: number, M: number, S: number } } = {
  390: {L: 0.0004150019, M: 0.0003683495, S: 0.009547289},
  395: {L: 0.001051914, M: 0.0009586496, S: 0.02382484},
  400: {L: 0.002408353, M: 0.002269917, S: 0.05665002},
  405: {L: 0.004833371, M: 0.004700132, S: 0.1224503},
  410: {L: 0.008721273, M: 0.008793667, S: 0.2330076},
  415: {L: 0.01338382, M: 0.0145278, S: 0.3813643},
  420: {L: 0.01844803, M: 0.02166506, S: 0.5436132},
  425: {L: 0.0229319, M: 0.02957127, S: 0.6744815},
  430: {L: 0.02818772, M: 0.03945663, S: 0.8025461},
  435: {L: 0.03410515, M: 0.0518203, S: 0.9035662},
  440: {L: 0.04025595, M: 0.06477837, S: 0.9910145},
  445: {L: 0.04493761, M: 0.07588048, S: 0.9915166},
  450: {L: 0.04986433, M: 0.08705225, S: 0.9553885},
  455: {L: 0.05534138, M: 0.09819288, S: 0.8602408},
  460: {L: 0.06471575, M: 0.1162733, S: 0.7867016},
  465: {L: 0.08069006, M: 0.1445407, S: 0.7382611},
  470: {L: 0.09947639, M: 0.1758936, S: 0.6463534},
  475: {L: 0.118801, M: 0.2053998, S: 0.5164164},
  480: {L: 0.1401458, M: 0.2357545, S: 0.3903373},
  485: {L: 0.1639532, M: 0.2680649, S: 0.290322},
  490: {L: 0.1915579, M: 0.3036267, S: 0.2118654},
  495: {L: 0.2329271, M: 0.357059, S: 0.160524},
  500: {L: 0.2889615, M: 0.4277598, S: 0.12284},
  505: {L: 0.3597162, M: 0.5155847, S: 0.08889554},
  510: {L: 0.4436801, M: 0.6155169, S: 0.0608205},
  515: {L: 0.536488, M: 0.7191508, S: 0.04281244},
  520: {L: 0.6285647, M: 0.8166012, S: 0.02920317},
  525: {L: 0.7047255, M: 0.8855437, S: 0.01939099},
  530: {L: 0.7706373, M: 0.9356857, S: 0.01260114},
  535: {L: 0.8257146, M: 0.9688577, S: 0.0080945},
  540: {L: 0.8810083, M: 0.9952221, S: 0.005088971},
  545: {L: 0.919073, M: 0.9971948, S: 0.003168911},
  550: {L: 0.9401995, M: 0.9771922, S: 0.001958935},
  555: {L: 0.9657395, M: 0.9565771, S: 0.001202763},
  560: {L: 0.9814541, M: 0.9177407, S: 0.000740167},
  565: {L: 0.994489, M: 0.8732126, S: 0.000455985},
  570: {L: 1, M: 0.8135046, S: 0.000281799},
  575: {L: 0.992316, M: 0.7402868, S: 0.000175037},
  580: {L: 0.9694379, M: 0.653281, S: 0.0001094536},
  585: {L: 0.9556085, M: 0.5725982, S: 0.00006899855},
  590: {L: 0.9276625, M: 0.492595, S: 0.00004390257},
  595: {L: 0.885972, M: 0.4112444, S: 0.00002822280},
  600: {L: 0.8339884, M: 0.334426, S: 0.00001834593},
  605: {L: 0.775104, M: 0.2648744, S: 0.00001206675},
  610: {L: 0.7057161, M: 0.2052721, S: 0.000008034895},
  615: {L: 0.6307685, M: 0.1562428, S: 0.000005418387},
  620: {L: 0.55423, M: 0.1166407, S: 0},
  625: {L: 0.4799434, M: 0.08558743, S: 0},
  630: {L: 0.4007098, M: 0.06211264, S: 0},
  635: {L: 0.3278612, M: 0.0444877, S: 0},
  640: {L: 0.2657847, M: 0.03142824, S: 0},
  645: {L: 0.2132849, M: 0.02180369, S: 0},
  650: {L: 0.1651391, M: 0.01544792, S: 0},
  655: {L: 0.1247498, M: 0.01071199, S: 0},
  660: {L: 0.09300794, M: 0.007302475, S: 0},
  665: {L: 0.06850937, M: 0.004971759, S: 0},
  670: {L: 0.04986664, M: 0.003436687, S: 0},
  675: {L: 0.03582284, M: 0.002376184, S: 0},
  680: {L: 0.02537932, M: 0.001637344, S: 0},
  685: {L: 0.01772025, M: 0.00112127, S: 0},
  690: {L: 0.01216998, M: 0.000761044, S: 0},
  695: {L: 0.008471687, M: 0.000525461, S: 0},
  700: {L: 0.005897527, M: 0.000365317, S: 0},
  705: {L: 0.004091288, M: 0.00025342, S: 0},
  710: {L: 0.002804465, M: 0.000174401, S: 0},
  715: {L: 0.00192057, M: 0.000120609, S: 0},
  720: {L: 0.001326875, M: 0.00008417245, S: 0},
  725: {L: 0.000917783, M: 0.00005893455, S: 0},
  730: {L: 0.000639367, M: 0.00004160449, S: 0},
  735: {L: 0.000446036, M: 0.00002943542, S: 0},
  740: {L: 0.0003108708, M: 0.00002088575, S: 0},
  745: {L: 0.0002193310, M: 0.00001504562, S: 0},
  750: {L: 0.0001545503, M: 0.00001082007, S: 0},
  755: {L: 0.0001095065, M: 0.000007822762, S: 0},
  760: {L: 0.00007799195, M: 0.000005690886, S: 0},
  765: {L: 0.00005562625, M: 0.000004139998, S: 0},
  770: {L: 0.00003992916, M: 0.000003026843, S: 0},
  775: {L: 0.00002861608, M: 0.000002211007, S: 0},
  780: {L: 0.00002073194, M: 0.000001634330, S: 0},
  785: {L: 0.00001504319, M: 0.000001210543, S: 0},
  790: {L: 0.00001094460, M: 0.0000008991658, S: 0},
  795: {L: 0.000007977555, M: 0.0000006695915, S: 0},
  800: {L: 0.000005850594, M: 0.0000005031874, S: 0},
  805: {L: 0.000004311021, M: 0.0000003800495, S: 0},
  810: {L: 0.000003170079, M: 0.0000002863255, S: 0},
  815: {L: 0.000002344661, M: 0.0000002168801, S: 0},
  820: {L: 0.000001746666, M: 0.0000001651581, S: 0},
  825: {L: 0.000001302417, M: 0.0000001255076, S: 0},
  830: {L: 0.0000009743162, M: 0.00000009534106, S: 0},
}

@Injectable({
  providedIn: 'root'
})
export class LmsConeResponseFunctionService {
  constructor(private http: HttpClient) {
  }

  getCmiLmsConeResponseFunction(): LmsConeResponseFunction {
    return (wavelength) => {
      const lowerBound = Math.max(
        ...Object.keys(cmiLmsConeResponseLut)
          .map(l => +l)
          .filter((l => l <= wavelength))
      );
      const upperBound = Math.min(
        ...Object.keys(cmiLmsConeResponseLut)
          .map(l => +l)
          .filter((l => l > wavelength))
      );
      if (isFinite(lowerBound) && isFinite(upperBound)) {
        return {
          L: (cmiLmsConeResponseLut[lowerBound].L * (upperBound - wavelength) + cmiLmsConeResponseLut[upperBound].L * (wavelength - lowerBound)) / (upperBound - lowerBound),
          M: (cmiLmsConeResponseLut[lowerBound].M * (upperBound - wavelength) + cmiLmsConeResponseLut[upperBound].M * (wavelength - lowerBound)) / (upperBound - lowerBound),
          S: (cmiLmsConeResponseLut[lowerBound].S * (upperBound - wavelength) + cmiLmsConeResponseLut[upperBound].S * (wavelength - lowerBound)) / (upperBound - lowerBound)
        }
      } else {
        return {L: 0, M: 0, S: 0};
      }
    }
  }

  getAbnormalLmsConeResponseFunction(protanomalyFactor: number, deuteranomalyFactor: number): LmsConeResponseFunction {
    const cmiLmsConeResponseFunction = this.getCmiLmsConeResponseFunction();
    return (wavelength) => {
      const cmiLmsConeResponse = cmiLmsConeResponseFunction(wavelength);
      return ({
        L: ((1 - protanomalyFactor) * cmiLmsConeResponse.L + protanomalyFactor * cmiLmsConeResponse.M),
        M: ((1 - deuteranomalyFactor) * cmiLmsConeResponse.M + deuteranomalyFactor * cmiLmsConeResponse.L),
        S: cmiLmsConeResponse.S
      });
    }
  }
}
