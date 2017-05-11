// Copyright (C) 2017  Simon Mika <simon@mika.se>
//
// This file is part of SysPL.
//
// SysPL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SysPL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SysPL.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error } from "@cogneco/mend"
import { Source } from "./Source"
import { Token } from "./Token"
import { Substance } from "./Substance"

export class Separator extends Substance {
	constructor(private symbol: string, region: Error.Region) {
		super(region)
	}
	getSymbol(): string {
		return this.symbol
	}
	isSeparator(symbol: string = null): boolean {
		return !symbol || this.symbol == symbol
	}
	static scan(source: Source): Token {
		var result: Token;
		switch (source.peek()) {
			case ".":
			case ":":
			case ";":
			case ",":
			case "[":
			case "]":
			case "(":
			case ")":
			case "{":
			case "}":
				result = new Separator(source.read(), source.mark())
				break
			default:
				result = null
		}
		return result
	}
}
