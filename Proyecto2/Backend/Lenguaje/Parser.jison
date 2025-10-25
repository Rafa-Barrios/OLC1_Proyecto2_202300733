// Analizador léxico
%{
    // Javascript
    let { errores } = require ('../Clases/Utilidades/Salida');
    const { Error } = require('../Clases/Utilidades/Error');
    const { TipoError } = require('../Clases/Utilidades/TipoError');
%}

%lex

// Expresiones regulares
UNUSED      [\s\r\t]+
INTEGER     [0-9]+\b
DOUBLE      [0-9]+\.[0-9]+\b
CONTENT     ([^\n\"\\]|\\.)
ID          [a-zA-Z_][a-zA-Z0-9_]*
STRING      \"({CONTENT}*)\"
CHAR        \'([^\'\\]|\\.)\'

%%

// Reglas semanticas
\n                      {}
{UNUSED}                {}
// Reservadas
"entero"                { return 'TK_entero'  }
"double"                { return 'TK_double'  }
"boolean"               { return 'TK_boolean' }
"true"                  { return 'TK_true' }
"false"                 { return 'TK_false' }
"cadena"                { return 'TK_cadena'  }
"caracter"              { return 'TK_caracter' }
"con"                   { return 'TK_con'     }
"valor"                 { return 'TK_valor'   }
"imprimir"              { return 'TK_imprimir'}
"si"                    { return 'TK_if'      }
"o"                     { return 'TK_else'    }
"para"                  { return 'TK_para'    }
"funcion"               { return 'TK_funcion'}
"retornar"               { return 'TK_retornar'}
"ejecutar"               { return 'TK_ejecutar'}
// Comentarios
"//".*                                 {/* Ignorar comentario de una línea */}
"/*"([^*]|\*+[^*/])*\*+"/"             {/* Ignorar comentario multilínea */}
// Valores
{ID}                    { return 'TK_id'     }
{STRING}                { yytext = yytext.slice(1, yyleng - 1); return 'TK_string' }
{CHAR}                  { yytext = yytext.slice(1, yyleng - 1); return 'TK_char'; }
{DOUBLE}                { return 'TK_decimal' }
{INTEGER}               { return 'TK_int'    }
"++"                    { return 'TK_incremento'      }
"--"                    { return 'TK_decremento'      }
// Símbolos
'+'                     { return 'TK_mas'             }
'-'                     { return 'TK_menos'           }
'*'                     { return 'TK_multiplicacion'  }
'/'                     { return 'TK_division'        }
'%'                     { return 'TK_modulo'          }
'^'                     { return 'TK_potencia'        }
'=='                    { return 'TK_igualdad'        }
'!='                    { return 'TK_diferente'       }
'='                     { return 'TK_asignacion'      }
'>='                    { return 'TK_mayorIgual'      }
'<='                    { return 'TK_menorIgual'      }
'>'                     { return 'TK_mayor'           }
'<'                     { return 'TK_menor'           }
'&&'                    { return 'TK_and'             }
'||'                    { return 'TK_or'              }
'!'                     { return 'TK_not'             }
'?'                     { return 'TK_interrogacion'   }
':'                     { return 'TK_dosPuntos'       }
'('                     { return 'TK_parAbre'         }
')'                     { return 'TK_parCierra'       }
'{'                     { return 'TK_llaveAbre'       }
'}'                     { return 'TK_llaveCierra'     }
','                     { return 'TK_coma'; }
';'                     { return 'TK_puntoComa'       }
.                       { errores.push(new Error(yylloc.first_line, yylloc.first_column + 1, TipoError.LEXICO, `Caracter no reconocido «${yytext}»`)) }
<<EOF>>                 { return 'EOF' }
/lex
// Analizador sintáctico

%{
    // Javascript
    // Tipos
    const { Tipo } = require('../Clases/Utilidades/Tipo');
    // Expresiones
    const { Primitivo } = require('../Clases/Expresiones/Primitivo');
    const { AccesoID } = require('../Clases/Expresiones/AccesoID');
    const { Aritmetico } = require('../Clases/Expresiones/Aritmetico');
    const { Ternario } = require('../Clases/Expresiones/Ternario');
    const { Casteo } = require('../Clases/Expresiones/Casteo');
    const { Relacional } = require('../Clases/Expresiones/Relacional');
    const { Logico } = require('../Clases/Expresiones/Logico');
    const { Retorno } = require('../Clases/Expresiones/Retorno');
    const { LlamadaFuncion } = require('../Clases/Expresiones/LlamadaFuncion');
    // Instrucciones
    const { DeclaracionID } = require('../Clases/Instrucciones/DeclaracionID');
    const { Reasignacion } = require('../Clases/Instrucciones/Reasignacion');
    const { Imprimir } = require('../Clases/Instrucciones/Imprimir');
    const { Si } = require('../Clases/Instrucciones/Si');
    const { Funcion } = require('../Clases/Instrucciones/Funcion');
    const { Para } = require('../Clases/Instrucciones/Para');
    const { Incremento } = require('../Clases/Instrucciones/Incremento');
    const { Decremento } = require('../Clases/Instrucciones/Decremento');

%}

// Precedencia de operadores
%left 'TK_or'
%left 'TK_and'
%right 'TK_not'
%left 'TK_igualdad', 'TK_diferente', 'TK_mayorIgual', 'TK_menorIgual', 'TK_mayor', 'TK_menor'
%left 'TK_mas', 'TK_menos'
%left 'TK_multiplicacion', 'TK_division', 'TK_modulo'
//%left 'TK_parAbre', 'TK_parCierra'
%right 'TK_potencia'
%right 'TK_interrogacion' 'TK_dosPuntos'
%right UMINUS

// %right TK_negacionUnaria

// Gramatica
%start INICIO
%%

INICIO :    
            INSTRUCCIONES EOF {return $1} |
            EOF                {return []} ;

INSTRUCCIONES :
            INSTRUCCIONES INSTRUCCION { if (Array.isArray($2)) $$.push(...$2); else $$.push($2); } |
            INSTRUCCION { $$ = Array.isArray($1) ? [...$1] : [$1]; } ;

INSTRUCCION :
            DECLARACION_VAR {$$ = $1} |
            REASIGNACION TK_puntoComa   {$$ = $1} |
            IMPRIMIR TK_puntoComa       {$$ = $1} |
            INCREMENTO_DECREMENTO       {$$ = $1} |
            CONDICIONAL_SI  {$$ = $1} |
            CICLO_PARA      {$$ = $1} |
            FUNCION         {$$ = $1} |
            RETORNAR TK_puntoComa        {$$ = $1} |
            error           {errores.push(new Error(this._$.first_line, this._$.first_column + 1, TipoError.SINTACTICO, `No se esperaba «${yytext}»`))} ;

LISTA_IDS : 
            TK_id { $$ = [$1]; } |
            LISTA_IDS TK_coma TK_id { $1.push($3); $$ = $1; } ;

LISTA_EXPRESIONES :
            EXPRESION { $$ = [$1]; } | 
            LISTA_EXPRESIONES TK_coma EXPRESION { $1.push($3); $$ = $1; } ;


DECLARACION_VAR :
            TIPO TK_id TK_con TK_valor EXPRESION TK_puntoComa { $$ = new DeclaracionID(@1.first_line, @1.first_column, $2, $1, $5); } |
            TIPO TK_id TK_puntoComa                           { $$ = new DeclaracionID(@1.first_line, @1.first_column, $2, $1, null); } |
            TIPO TK_id TK_asignacion EXPRESION TK_puntoComa   { $$ = new DeclaracionID(@1.first_line, @1.first_column, $2, $1, $4); } |
            TIPO LISTA_IDS TK_puntoComa                       { $$ = []; var idsList = $2; for (var i = 0; i < idsList.length; i++) { $$.push(new DeclaracionID(@1.first_line, @1.first_column, idsList[i], $1, null)); } } |
            TIPO LISTA_IDS TK_con TK_valor LISTA_EXPRESIONES TK_puntoComa { $$ = []; var idsList = $2; var valoresList = $5; for (var i = 0; i < idsList.length; i++) { var val = (i < valoresList.length) ? valoresList[i] : null; $$.push(new DeclaracionID(@1.first_line, @1.first_column, idsList[i], $1, val)); } } |
            TIPO LISTA_IDS TK_asignacion LISTA_EXPRESIONES TK_puntoComa { $$ = []; var idsList = $2; var valoresList = $4; for (var i = 0; i < idsList.length; i++) { var val = (i < valoresList.length) ? valoresList[i] : null; $$.push(new DeclaracionID(@1.first_line, @1.first_column, idsList[i], $1, val)); } } ;

REASIGNACION : TK_id TK_asignacion EXPRESION {$$ = new Reasignacion(@1.first_line, @1.first_column, $1, $3)} ;

IMPRIMIR :
            TK_imprimir EXPRESION {$$ = new Imprimir(@1.first_line, @1.first_column, $2)} ;

// Instrucciones
// === CONDICIONAL SI ===
CONDICIONAL_SI : TK_if TK_parAbre EXPRESION TK_parCierra TK_llaveAbre INSTRUCCIONES TK_llaveCierra {$$ = new Si(@1.first_line, @1.first_column, $3, $6)} ;

// === CICLO PARA ===
CICLO_PARA : TK_para TK_parAbre REASIGNACION TK_puntoComa EXPRESION TK_puntoComa EXPRESION TK_parCierra TK_llaveAbre INSTRUCCIONES TK_llaveCierra ;

// === Funciones ===
FUNCION : TK_funcion TIPO TK_id TK_parAbre TK_parCierra TK_llaveAbre INSTRUCCIONES TK_llaveCierra {$$ = new Funcion(@1.first_line, @1.first_column, $3, $2, $7)} ;

// Expresiones
EXPRESION : 
            TERNARIO     {$$ = $1} |
            RELACIONALES {$$ = $1} |
            LOGICOS      {$$ = $1} |
            ARITMETICOS  {$$ = $1} |
            CASTEO       {$$ = $1} |
            LLAMADA_FUNCION           {$$ = $1} |
            TK_id      {$$ = new AccesoID(@1.first_line, @1.first_column, $1              )} |
            TK_int     {$$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.ENTERO)} |
            TK_decimal {$$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.DOUBLE)} |
            TK_string  {$$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.CADENA)} |
            TK_char    {$$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.CARACTER)} |
            TK_true  {$$ = new Primitivo(@1.first_line, @1.first_column, true, Tipo.BOOLEANO)} |
            TK_false {$$ = new Primitivo(@1.first_line, @1.first_column, false, Tipo.BOOLEANO)} |
            TK_parAbre EXPRESION TK_parCierra {$$ = $2};

TERNARIO :
      RELACIONALES TK_interrogacion EXPRESION TK_dosPuntos EXPRESION
        { $$ = new Ternario(@1.first_line, @1.first_column, $1, $3, $5); } ;

ARITMETICOS : 
            // Negación unaria (-exp)
            TK_menos EXPRESION %prec UMINUS
                { $$ = new Aritmetico(
                        @1.first_line,
                        @1.first_column,
                        new Primitivo(@1.first_line, @1.first_column, 0, Tipo.ENTERO),
                        $1,
                        $2
                    ); } |    
            EXPRESION TK_mas EXPRESION            {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_menos EXPRESION          {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_multiplicacion EXPRESION {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_division EXPRESION       {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_potencia EXPRESION       {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_modulo EXPRESION         {$$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3)} ;

RELACIONALES :
            EXPRESION TK_igualdad EXPRESION   {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_diferente EXPRESION  {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_mayor EXPRESION      {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_menor EXPRESION      {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_mayorIgual EXPRESION {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} |
            EXPRESION TK_menorIgual EXPRESION {$$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3)} ;

LOGICOS :
            EXPRESION TK_and EXPRESION {$$ = new Logico(@1.first_line, @1.first_column, $1, $2, $3)}|
            EXPRESION TK_or EXPRESION  {$$ = new Logico(@1.first_line, @1.first_column, $1, $2, $3)}|
            TK_not EXPRESION           {$$ = new Logico(@1.first_line, @1.first_column, undefined, $1, $2)};

INCREMENTO_DECREMENTO :
            TK_id TK_incremento TK_puntoComa { $$ = new Incremento(@1.first_line, @1.first_column, $1); } |
            TK_id TK_decremento TK_puntoComa { $$ = new Decremento(@1.first_line, @1.first_column, $1); } ;

CASTEO :
        TK_parAbre TIPO TK_parCierra EXPRESION { $$ = new Casteo(@1.first_line, @1.first_column, $2, $4); } ;

RETORNAR :
        TK_retornar EXPRESION {$$ = new Retorno(@1.first_line, @1.first_column, $2)} ;

LLAMADA_FUNCION : TK_ejecutar TK_id TK_parAbre TK_parCierra {$$ = new LlamadaFuncion(@1.first_line, @1.first_column, $2, undefined)} ;

TIPO : 
        TK_entero {$$ = Tipo.ENTERO} | 
        TK_double {$$ = Tipo.DOUBLE} |
        TK_cadena {$$ = Tipo.CADENA} |
        TK_boolean {$$ = Tipo.BOOLEANO} |
        TK_caracter {$$ = Tipo.CARACTER} ;