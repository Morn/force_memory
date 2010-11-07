/*
*TODO: local file operation on firefox
*code source: http://blog.csdn.net/sysdzw/archive/2010/04/21/5511755.aspx
*
*
*/

(function () {
 
function save(path, content) {
	var file,
		result,
		converter,
		convSource,
		outputStream;
		
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
	}
	catch (e) {  
		alert("Permission to save file was denied.");  
	}  
	file = Components.classes["@mozilla.org/file/local;1"].
		createInstance(Components.interfaces.nsILocalFile);  
	file.initWithPath(path);  
	if (file.exists() == false) {  
		alert("Creating file... ");  
		file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);  
	}  
	outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
		createInstance(Components.interfaces.nsIFileOutputStream);
	outputStream.init(file, 0x04 | 0x08 | 0x20, 420, 0);
	converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]  
				 .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);  
	converter.charset = 'UTF-8';
	convSource = converter.ConvertFromUnicode(content);  
	result = outputStream.write(convSource, convSource.length);  
	outputStream.close();  
}  

function read(path) {
	var is,
		sis,
		file,
		output,
		converter;
		
	try {  
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
	}
	catch (e) {  
		alert("Permission to read file was denied.");  
	}  
	file = Components.classes["@mozilla.org/file/local;1"].
		createInstance(Components.interfaces.nsILocalFile);  
	file.initWithPath(path);  
	if (file.exists() == false) {  
		alert("File does not exist");  
	}  
	is = Components.classes["@mozilla.org/network/file-input-stream;1"].
		createInstance(Components.interfaces.nsIFileInputStream);  
	is.init(file, 0x01, 00004, null);  
	sis = Components.classes["@mozilla.org/scriptableinputstream;1"].
		createInstance(Components.interfaces.nsIScriptableInputStream);  
	sis.init(is);  
	converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
		createInstance(Components.interfaces.nsIScriptableUnicodeConverter);  
	converter.charset = "UTF-8";  
	output = converter.ConvertToUnicode(sis.read(sis.available()));  
	return output;
}  
//save("d:\\Yes.txt","How's it then ?");  
//alert(read("d:\\Yes.txt"));  
 
} ());
 
 