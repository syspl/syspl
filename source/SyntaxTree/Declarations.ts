// Copyright (C) 2018 Simon Mika <simon@mika.se>
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

import { Declaration } from "./Declaration"
import { Node } from "./Node"

export class Declarations extends Declaration {
	get class() { return "declarations" }
	constructor(private declarationArray: Declaration[], original?: Node) {
		super(declarationArray.length > 0 && declarationArray[0] ? declarationArray[0].symbol : "", original)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			declarations: this.declarationArray.length > 0 ? this.declarationArray.map(a => a.serialize()) : undefined,
		}
	}
}
