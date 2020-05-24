import { IMemory } from "./interfaces";

interface IClock {
  m: number;
  t: number;
}

interface IRegisterSet {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  f: number;
  /** Program counter */
  pc: number;
  /** Stack pointer */
  sp: number;
}

/**
 * Emulates a Z80 CPU
 */
export class Cpu {
  private _c: IClock = {
    m: 0,
    t: 0
  };

  private _r: IRegisterSet = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    h: 0,
    l: 0,
    f: 0,
    pc: 0,
    sp: 0
  };

  private _reset() {
    this._r.a = 0;
    this._r.a = 0;
    this._r.b = 0;
    this._r.c = 0;
    this._r.d = 0;
    this._r.e = 0;
    this._r.h = 0;
    this._r.l = 0;
    this._r.f = 0;
    this._r.pc = 0;
    this._r.sp = 0;
    this._c.m = 0;
    this._c.t = 0;
  }

  private _createOp(op: () => void, cost: number) {
    return () => {
      op();
      this._c.m += cost;
      this._c.t += cost * 4;
    };
  }
}

type IOperation = (r: IRegisterSet, m: IMemory) => number;

function createOp(f: (r: IRegisterSet, m: IMemory) => void, cost: number): IOperation {
  return (r, m) => {
    f(r, m);
    return cost;
  };
}

const o = {
  LD_A_A: createOp((r) => { r.a = r.a; }, 1),
  LD_A_B: createOp((r) => { r.a = r.b; }, 1),
  LD_A_C: createOp((r) => { r.a = r.c; }, 1),
  LD_A_D: createOp((r) => { r.a = r.d; }, 1),
  LD_A_E: createOp((r) => { r.a = r.e; }, 1),
  LD_A_H: createOp((r) => { r.a = r.h; }, 1),
  LD_A_L: createOp((r) => { r.a = r.l; }, 1),
  LD_A_BC: createOp((r, m) => { r.a = m.rb(r.b << 8 + r.c); }, 2),
  LD_A_DE: createOp((r, m) => { r.a = m.rb(r.d << 8 + r.e); }, 2),
  LD_A_HL: createOp((r, m) => { r.a = m.rb(r.h << 8 + r.l); }, 2),
  LD_A_nn: createOp((r, m) => { r.a = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_A_n: createOp((r, m) => { r.a = m.rb(r.pc++); }, 2),
  LD_B_A: createOp((r) => { r.b = r.a; }, 1),
  LD_B_B: createOp((r) => { r.b = r.b; }, 1),
  LD_B_C: createOp((r) => { r.b = r.c; }, 1),
  LD_B_D: createOp((r) => { r.b = r.d; }, 1),
  LD_B_E: createOp((r) => { r.b = r.e; }, 1),
  LD_B_H: createOp((r) => { r.b = r.h; }, 1),
  LD_B_L: createOp((r) => { r.b = r.l; }, 1),
  LD_B_BC: createOp((r, m) => { r.b = m.rb(r.b << 8 + r.c); }, 2),
  LD_B_DE: createOp((r, m) => { r.b = m.rb(r.d << 8 + r.e); }, 2),
  LD_B_HL: createOp((r, m) => { r.b = m.rb(r.h << 8 + r.l); }, 2),
  LD_B_nn: createOp((r, m) => { r.b = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_B_n: createOp((r, m) => { r.b = m.rb(r.pc++); }, 2),
  LD_C_A: createOp((r) => { r.c = r.a; }, 1),
  LD_C_B: createOp((r) => { r.c = r.b; }, 1),
  LD_C_C: createOp((r) => { r.c = r.c; }, 1),
  LD_C_D: createOp((r) => { r.c = r.d; }, 1),
  LD_C_E: createOp((r) => { r.c = r.e; }, 1),
  LD_C_H: createOp((r) => { r.c = r.h; }, 1),
  LD_C_L: createOp((r) => { r.c = r.l; }, 1),
  LD_C_BC: createOp((r, m) => { r.c = m.rb(r.b << 8 + r.c); }, 2),
  LD_C_DE: createOp((r, m) => { r.c = m.rb(r.d << 8 + r.e); }, 2),
  LD_C_HL: createOp((r, m) => { r.c = m.rb(r.h << 8 + r.l); }, 2),
  LD_C_nn: createOp((r, m) => { r.c = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_C_n: createOp((r, m) => { r.c = m.rb(r.pc++); }, 2),
  LD_D_A: createOp((r) => { r.d = r.a; }, 1),
  LD_D_B: createOp((r) => { r.d = r.b; }, 1),
  LD_D_C: createOp((r) => { r.d = r.c; }, 1),
  LD_D_D: createOp((r) => { r.d = r.d; }, 1),
  LD_D_E: createOp((r) => { r.d = r.e; }, 1),
  LD_D_H: createOp((r) => { r.d = r.h; }, 1),
  LD_D_L: createOp((r) => { r.d = r.l; }, 1),
  LD_D_BC: createOp((r, m) => { r.d = m.rb(r.b << 8 + r.c); }, 2),
  LD_D_DE: createOp((r, m) => { r.d = m.rb(r.d << 8 + r.e); }, 2),
  LD_D_HL: createOp((r, m) => { r.d = m.rb(r.h << 8 + r.l); }, 2),
  LD_D_nn: createOp((r, m) => { r.d = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_D_n: createOp((r, m) => { r.d = m.rb(r.pc++); }, 2),
  LD_E_A: createOp((r) => { r.e = r.a; }, 1),
  LD_E_B: createOp((r) => { r.e = r.b; }, 1),
  LD_E_C: createOp((r) => { r.e = r.c; }, 1),
  LD_E_D: createOp((r) => { r.e = r.d; }, 1),
  LD_E_E: createOp((r) => { r.e = r.e; }, 1),
  LD_E_H: createOp((r) => { r.e = r.h; }, 1),
  LD_E_L: createOp((r) => { r.e = r.l; }, 1),
  LD_E_BC: createOp((r, m) => { r.e = m.rb(r.b << 8 + r.c); }, 2),
  LD_E_DE: createOp((r, m) => { r.e = m.rb(r.d << 8 + r.e); }, 2),
  LD_E_HL: createOp((r, m) => { r.e = m.rb(r.h << 8 + r.l); }, 2),
  LD_E_nn: createOp((r, m) => { r.e = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_E_n: createOp((r, m) => { r.e = m.rb(r.pc++); }, 2),
  LD_H_A: createOp((r) => { r.h = r.a; }, 1),
  LD_H_B: createOp((r) => { r.h = r.b; }, 1),
  LD_H_C: createOp((r) => { r.h = r.c; }, 1),
  LD_H_D: createOp((r) => { r.h = r.d; }, 1),
  LD_H_E: createOp((r) => { r.h = r.e; }, 1),
  LD_H_H: createOp((r) => { r.h = r.h; }, 1),
  LD_H_L: createOp((r) => { r.h = r.l; }, 1),
  LD_H_BC: createOp((r, m) => { r.h = m.rb(r.b << 8 + r.c); }, 2),
  LD_H_DE: createOp((r, m) => { r.h = m.rb(r.d << 8 + r.e); }, 2),
  LD_H_HL: createOp((r, m) => { r.h = m.rb(r.h << 8 + r.l); }, 2),
  LD_H_nn: createOp((r, m) => { r.h = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_H_n: createOp((r, m) => { r.h = m.rb(r.pc++); }, 2),
  LD_L_A: createOp((r) => { r.l = r.a; }, 1),
  LD_L_B: createOp((r) => { r.l = r.b; }, 1),
  LD_L_C: createOp((r) => { r.l = r.c; }, 1),
  LD_L_D: createOp((r) => { r.l = r.d; }, 1),
  LD_L_E: createOp((r) => { r.l = r.e; }, 1),
  LD_L_H: createOp((r) => { r.l = r.h; }, 1),
  LD_L_L: createOp((r) => { r.l = r.l; }, 1),
  LD_L_BC: createOp((r, m) => { r.l = m.rb(r.b << 8 + r.c); }, 2),
  LD_L_DE: createOp((r, m) => { r.l = m.rb(r.d << 8 + r.e); }, 2),
  LD_L_HL: createOp((r, m) => { r.l = m.rb(r.h << 8 + r.l); }, 2),
  LD_L_nn: createOp((r, m) => { r.l = m.rb(m.rw(r.pc)); r.pc += 2; }, 4),
  LD_L_n: createOp((r, m) => { r.l = m.rb(r.pc++); }, 2),
  LD_HL_B: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.b); }, 2),
  LD_HL_C: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.c); }, 2),
  LD_HL_D: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.d); }, 2),
  LD_HL_E: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.e); }, 2),
  LD_HL_H: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.h); }, 2),
  LD_HL_L: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.l); }, 2),
  LD_HL_n: createOp((r, m) => { m.wb(r.h << 8 + r.l, m.rb(r.pc++)); }, 3),

  LD_BC_A: createOp((r, m) => { m.wb(r.b << 8 + r.c, r.a); }, 2),
  LD_DE_A: createOp((r, m) => { m.wb(r.d << 8 + r.e, r.a); }, 2),
  LD_HL_A: createOp((r, m) => { m.wb(r.h << 8 + r.l, r.a); }, 2),
  LD_nn_A: createOp((r, m) => { m.wb(m.rw(r.pc), r.a); r.pc += 2; }, 4),

  LD_A_FFC: createOp((r, m) => { r.a = m.rb(0xFF00 + r.c); }, 2),
  LD_FFC_A: createOp((r, m) => { m.wb(0xFF00 + r.c, r.a); }, 2),
  LD_A_HLD: createOp((r, m) => {
    o.LD_A_HL(r, m);
    r.l = (r.l - 1) & 255;
    if (r.l === 255) {
      r.h = (r.h - 1) & 255;
    }
  }, 2),
  LD_HLD_A: createOp((r, m) => {
    o.LD_HL_A(r, m);
    r.l = (r.l - 1) & 255;
    if (r.l === 255) {
      r.h = (r.h - 1) & 255;
    }
  }, 2),
  LD_A_HLI: createOp((r, m) => {
    o.LD_A_HL(r, m);
    r.l = (r.l + 1) & 255;
    if (r.l === 0) {
      r.h = (r.h + 1) & 255;
    }
  }, 2),
  LD_HLI_A: createOp((r, m) => {
    o.LD_HL_A(r, m);
    r.l = (r.l + 1) & 255;
    if (r.l === 0) {
      r.h = (r.h + 1) & 255;
    }
  }, 2),
  LD_FFn_A: createOp((r, m) => { m.wb(0xFF00 + m.rb(r.pc++), r.a); }, 3),
  LD_A_FFn: createOp((r, m) => { r.a = m.rb(0xFF00 + m.rb(r.pc++)); }, 3),

  LD_BC_nn: createOp((r, m) => { r.c = m.rb(r.pc++); r.b = m.rb(r.pc++); }, 3),
  LD_DE_nn: createOp((r, m) => { r.e = m.rb(r.pc++); r.d = m.rb(r.pc++); }, 3),
  LD_HL_nn: createOp((r, m) => { r.l = m.rb(r.pc++); r.h = m.rb(r.pc++); }, 3),
  LD_SP_nn: createOp((r, m) => { r.sp = m.rw(r.pc); r.pc += 2; }, 3),
  LD_SP_HL: createOp((r, m) => { r.sp = m.rb(r.h) << 8 | m.rb(r.l); }, 2),
  LD_SP_HLn: createOp((r, m) => {
    r.sp = m.rb(r.h) << 8 | m.rb(r.l);
  }, 3),

  NOP: createOp(() => {}, 1)
}

const oMap: (IOperation | undefined)[] = [
  // 00
  o.NOP,
  o.LD_BC_nn,
  o.LD_BC_A,
  undefined,
  undefined,
  undefined,
  o.LD_B_n,
  undefined,
  undefined,
  undefined,
  o.LD_A_BC,
  undefined,
  undefined,
  undefined,
  o.LD_C_n,
  undefined,

  // 10
  undefined,
  o.LD_DE_nn,
  o.LD_DE_A,
  undefined,
  undefined,
  undefined,
  o.LD_D_n,
  undefined,
  undefined,
  undefined,
  o.LD_A_DE,
  undefined,
  undefined,
  undefined,
  o.LD_E_n,
  undefined,

  // 20
  undefined,
  o.LD_HL_nn,
  o.LD_HLI_A,
  undefined,
  undefined,
  undefined,
  o.LD_H_n,
  undefined,
  undefined,
  undefined,
  o.LD_A_HLI,
  undefined,
  undefined,
  undefined,
  o.LD_L_n,
  undefined,

  // 30
  undefined,
  o.LD_SP_nn,
  o.LD_HLD_A,
  undefined,
  undefined,
  undefined,
  o.LD_HL_n,
  undefined,
  undefined,
  undefined,
  o.LD_A_HLD,
  undefined,
  undefined,
  undefined,
  o.LD_A_n,
  undefined,

  // 40
  o.LD_B_B,
  o.LD_B_C,
  o.LD_B_D,
  o.LD_B_E,
  o.LD_B_H,
  o.LD_B_L,
  o.LD_B_HL,
  o.LD_B_A,
  o.LD_C_B,
  o.LD_C_C,
  o.LD_C_D,
  o.LD_C_E,
  o.LD_C_H,
  o.LD_C_L,
  o.LD_C_HL,
  o.LD_C_A,

  // 50
  o.LD_D_B,
  o.LD_D_C,
  o.LD_D_D,
  o.LD_D_E,
  o.LD_D_H,
  o.LD_D_L,
  o.LD_D_HL,
  o.LD_D_A,
  o.LD_E_B,
  o.LD_E_C,
  o.LD_E_D,
  o.LD_E_E,
  o.LD_E_H,
  o.LD_E_L,
  o.LD_E_HL,
  o.LD_E_A,

  // 60
  o.LD_H_B,
  o.LD_H_C,
  o.LD_H_D,
  o.LD_H_E,
  o.LD_H_H,
  o.LD_H_L,
  o.LD_H_HL,
  o.LD_H_A,
  o.LD_L_B,
  o.LD_L_C,
  o.LD_L_D,
  o.LD_L_E,
  o.LD_L_H,
  o.LD_L_L,
  o.LD_L_HL,
  o.LD_L_A,

  // 70
  o.LD_HL_B,
  o.LD_HL_C,
  o.LD_HL_D,
  o.LD_HL_E,
  o.LD_HL_H,
  o.LD_HL_L,
  o.LD_HL_A,
  undefined,
  o.LD_A_B,
  o.LD_A_C,
  o.LD_A_D,
  o.LD_A_E,
  o.LD_A_H,
  o.LD_A_L,
  o.LD_A_HL,
  o.LD_A_A,

  // 80
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // 90
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // A0
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // B0
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // C0
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // D0
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // E0
  o.LD_FFn_A,
  undefined,
  o.LD_FFC_A,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  o.LD_nn_A,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,

  // F0
  o.LD_A_FFn,
  undefined,
  o.LD_A_FFC,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  o.LD_SP_HL,
  o.LD_A_nn,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];
