const DataType: {[key:string]:string} = {
  TEXT_PLAIN: "text/plain",
  TEXT_HTML: "text/html"
};

const DataTypeLookup: Set<string> = new Set<string>();
for (var key in DataType) {
  DataTypeLookup.add(DataType[key]);
}

// TODO: Dedup with main file?
var warn = (console.warn || console.log).bind(console, "[clipboard-polyfill]");

export class DT {
  private m: Map<string, string> = new Map<string, string>();

  public setData(type: string, value: string): void {
    if (!(DataTypeLookup.has(type))) {
      warn("Unknown data type: " + type);
    }

    this.m.set(type, value);
  }

  public getData(type: string): string | undefined {
    return this.m.get(type);
  }

  // TODO: Provide an iterator consistent with DataTransfer.
  public forEach(f: (value: string, key: string) => void): void {
    return this.m.forEach(f);
  }
}

export class Convenience {
  public static DTFromText(s: string): DT {
    var dt = new DT();
    dt.setData("text/plain", s);
    return dt;
  }

  public static DTFromObject(obj: {[key:string]:string}): DT {
    var dt = new DT();
    for (var key in obj) {
      dt.setData(key, obj[key]);
    }
    return dt;
  }

  public static DTFromElement(e: HTMLElement): DT {
    var dt = new DT();
    dt.setData("text/plain", e.innerText);
    dt.setData("text/html", new XMLSerializer().serializeToString(e));
    return dt;
  }
}
