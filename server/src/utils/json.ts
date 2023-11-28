type CallbackFunction = (str: string) => string;

export function fixJSON(json: any): any | false {
	function bulkRegex(str: string, callback: CallbackFunction | CallbackFunction[]): string {
		if (callback && typeof callback === "function") {
			return callback(str);
		} else if (callback && Array.isArray(callback)) {
			for (let i = 0; i < callback.length; i++) {
				if (callback[i] && typeof callback[i] === "function") {
					str = callback[i](str);
				} else { break; }
			}
			return str;
		}
		return str;
	}

	if (json && json !== "") {
		if (typeof json !== "string") {
			try {
				json = JSON.stringify(json);
			} catch (e) { return false; }
		}
		if (typeof json === "string") {
			json = bulkRegex(json, [
				str => str.replace(/[\n\t]/gm, ""),
				str => str.replace(/,}/gm, "}"),
				str => str.replace(/,]/gm, "]"),
				str => {
					let strs = str.split(/(?=[,}\]])/g);
					strs = strs.map(s => {
						if (s.includes(":") && s) {
							const strP = s.split(/:(.+)/, 2);
							strP[0] = strP[0].trim();
							if (strP[0]) {
								const firstP = strP[0].split(/([,{\[])/g);
								firstP[firstP.length - 1] = bulkRegex(firstP[firstP.length - 1], p => p.replace(/[^A-Za-z0-9\-_]/, ""));
								strP[0] = firstP.join("");
							}
							let part = strP[1].trim();
							if ((part.startsWith("\"") && part.endsWith("\"")) || (part.startsWith("'") && part.endsWith("'")) || (part.startsWith("`") && part.endsWith("`"))) {
								part = part.substr(1, part.length - 2);
							}
							part = bulkRegex(part, [
								p => p.replace(/(")/gm, "\\$1"),
								p => p.replace(/\\'/gm, "'"),
								p => p.replace(/\\`/gm, "`"),
							]);
							strP[1] = ("\"" + part + "\"").trim();
							s = strP.join(":");
						}
						return s;
					});
					return strs.join("");
				},
				str => str.replace(/(['"])?([a-zA-Z0-9\-_]+)(['"])?:/g, "\"$2\":"),
				str => {
					let strs = str.split(/(?=[,}\]])/g);
					strs = strs.map(s => {
						if (s.includes(":") && s) {
							const strP = s.split(/:(.+)/, 2);
							strP[0] = strP[0].trim();
							if (strP[1].includes("\"") && strP[1].includes(":")) {
								let part = strP[1].trim();
								if (part.startsWith("\"") && part.endsWith("\"")) {
									part = part.substring(1, part.length - 2);
									part = bulkRegex(part, p => p.replace(/(?<!\\)"/gm, ""));
								}
								strP[1] = ("\"" + part + "\"").trim();
							}
							s = strP.join(":");
						}
						return s;
					});
					return strs.join("");
				},
			]);
			try {
				json = JSON.parse(json);
			} catch (e) { return false; }
		}
		return json;
	}
	return false;
}
