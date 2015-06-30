/* Task Description */
/*
 * Create an object domElement, that has the following properties and methods:
 * use prototypal inheritance, without function constructors
 * method init() that gets the domElement type
 * i.e. `Object.create(domElement).init('div')`
 * property type that is the type of the domElement
 * a valid type is any non-empty string that contains only Latin letters and digits
 * property innerHTML of type string
 * gets the domElement, parsed as valid HTML
 * <type attr1="value1" attr2="value2" ...> .. content / children's.innerHTML .. </type>
 * property content of type string
 * sets the content of the element
 * works only if there are no children
 * property attributes
 * each attribute has name and value
 * a valid attribute has a non-empty string for a name that contains only Latin letters and digits or dashes (-)
 * property children
 * each child is a domElement or a string
 * property parent
 * parent is a domElement
 * method appendChild(domElement / string)
 * appends to the end of children list
 * method addAttribute(name, value)
 * throw Error if type is not valid
 * method removeAttribute(attribute)
 * throw Error if attribute does not exist in the domElement
 */


/* Example

 var meta = Object.create(domElement)
 .init('meta')
 .addAttribute('charset', 'utf-8');

 var head = Object.create(domElement)
 .init('head')
 .appendChild(meta)

 var div = Object.create(domElement)
 .init('div')
 .addAttribute('style', 'font-size: 42px');

 div.content = 'Hello, world!';

 var body = Object.create(domElement)
 .init('body')
 .appendChild(div)
 .addAttribute('id', 'cuki')
 .addAttribute('bgcolor', '#012345');

 var root = Object.create(domElement)
 .init('html')
 .appendChild(head)
 .appendChild(body);

 console.log(root.innerHTML);
 Outputs:
 <html><head><meta charset="utf-8"></meta></head><body bgcolor="#012345" id="cuki"><div style="font-size: 42px">Hello, world!</div></body></html>
 */


function solve() {
    var domElement = (function () {
        var validateType = function(type){
            if(typeof type !== 'string'){
                throw new Error('Incorrect type');
            }
            if( type.length < 1){
                throw new Error("Incorrect type");
            }

            if(!/^[A-Za-z0-9\-]+$/.test(type)){
                throw new Error("Invalid type");
            }
        };
        var validateAttribute = function(name, value){
            validateType(name);
        };

        var domElement = {
            init: function (type) {
                validateType(type);
                this.type = type;
                this.parent;
                this.content='';
                this.attributes = {};
                this.children = [];
                return this;
            },
            appendChild: function (child) {

                if(typeof child === 'object'){
                    child.parent = this;
                }

                this.children.push(child);

                return this;
            },
            addAttribute: function (name, value) {

                validateAttribute(name, value);
                this.attributes[name] = value;
                return this;
            },
            removeAttribute: function (attrName) {
                if(this.attributes.hasOwnProperty(attrName)){
                    delete this.attributes[attrName];
                } else {
                    throw new Error("Non existing attribute");
                }
                return this;
            },
            get innerHTML() {
                var result =  '<'+this.type;
                var keys = Object.keys(this.attributes);
                keys.sort();
                var att = this.attributes;
                keys.forEach(function(key){
                    result += ' '+key +'="'+ att[key]+'"';
                });

                result+='>';
                var content = this.content;
                var inner = '';
                this.children.forEach(function(child){
                    content = '';
                    if(typeof child === 'string'){
                        inner += child;
                    } else{
                        inner += child.innerHTML;
                    }
                });
                result+= content + inner+'</'+this.type+'>';
                return result;
            }
        };
        return domElement;
    }());
    return domElement;
}
module.exports = solve;
