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

import * as SyntaxTree from "../SyntaxTree"
import { Scope, addResolver } from "./Scope"

function resolve(literal: SyntaxTree.Literal.Abstract, scope: Scope): SyntaxTree.Literal.Abstract {
	return literal
}
addResolver("literal.character", (statement: SyntaxTree.Statement, scope: Scope) => resolve(statement as SyntaxTree.Literal.Abstract, scope))
addResolver("literal.number", (statement: SyntaxTree.Statement, scope: Scope) => resolve(statement as SyntaxTree.Literal.Abstract, scope))
addResolver("literal.string", (statement: SyntaxTree.Statement, scope: Scope) => resolve(statement as SyntaxTree.Literal.Abstract, scope))
