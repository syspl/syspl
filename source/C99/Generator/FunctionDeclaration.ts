// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import * as SyntaxTree from "../SyntaxTree"
import { addGenerator } from "./Generator"

addGenerator<SyntaxTree.FunctionDeclaration>("FunctionDeclaration",
	async (generator, node) => {
		let notFirst = false
		return  await generator.generate(node.type) &&
			await generator.write(" ") &&
			await generator.write(node.symbol) &&
			await generator.write("(") &&
			node.argumentList.map(async item => (notFirst = !notFirst || await generator.write(", ")) && generator.generate(item)).reduce((r, item) => item && r, true) &&
			await generator.write(")") &&
			await generator.writeLine(" {") &&
			generator.increase() &&
			await generator.generate(node.statements) &&
			generator.decrease() &&
			generator.writeLine("}")
	},
)
