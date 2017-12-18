// Ids for google libraries
var clientId = '774113262631-a5l95m7mdls1uu71j6p3r76ibnchmn9a.apps.googleusercontent.com';
var developerKey = 'AIzaSyDeXy435858cpXa59Qfr9ag310TLPS7tl0';
var appId = '774113262631';

var fileId;
var fileName;

var picker;
var oauthToken;

// Realtime Collaborative objects
var app;
var docModel;

var Node = function() {};
var Edge = function() {};

var objNode;
var objEdge;

var lstNodes;
var lstEdges;

var strEditName;

var strRemoveNode;
var strRemoveEdge;

var button = document.getElementById('auth_button');
button.classList.toggle('invisible', false);

var newButton = document.getElementById('new_button');

var loadButton = document.getElementById('load_button');

var renameButton = document.getElementById('rename_button');

newButton.disabled = "disabled";
loadButton.disabled = "disabled";
renameButton.disabled = "disabled";

onLoadHandler();

function onLoadHandler() {
	console.log("onLoadHandler");
	gapi.load('client:auth2,drive-realtime,drive-share,picker', authorize);
}

function authorize() {
	// Attempt to authorize
	document.getElementById('loader').style.display = 'block';
	
	realtimeUtils.authorize(function(response) {
		if(response.error) {
			// Authorization failed because this is the first time the user has used your application,
			// show the authorize button to prompt them to authorize manually.
			document.getElementById('loader').style.display = 'none';
			
			button.addEventListener('click', function () {
				realtimeUtils.authorize(function(response) {
					button.disabled = "disabled";
					newButton.disabled = "";
					loadButton.disabled = "";
					renameButton.disabled = "";
					
					if(response && !response.error) {
						oauthToken = response.access_token;
						pickerApiLoaded = true;
					}
					start();
				}, true);
			});
		}
		else {
			button.innerHTML = "Signed In";
			button.disabled = "disabled";
			newButton.disabled = "";
			loadButton.disabled = "";
			renameButton.disabled = "";
			
			if(response && !response.error) {
				oauthToken = response.access_token;
				pickerApiLoaded = true;
			}
			document.getElementById('loader').style.display = 'none';
			start();
		}
	}, false);
}

// Create and render a Picker object for searching.
function createPicker() {
	if(picker != null) {
		picker.dispose();
	}
	if(pickerApiLoaded && oauthToken) {
		var view = new google.picker.View(google.picker.ViewId.DOCS);
		view.setMimeTypes('application/vnd.google-apps.drive-sdk.774113262631');
		picker = new google.picker.PickerBuilder()
			.enableFeature(google.picker.Feature.NAV_HIDDEN)
			.setAppId(appId)
			.setOAuthToken(oauthToken)
			.addView(view)
			.addView(new google.picker.DocsUploadView())
			.setDeveloperKey(developerKey)
			.setCallback(pickerCallback)
			.build();
		picker.setVisible(true);
	}
}

// A simple callback implementation.
function pickerCallback(data) {
	if(data.action == google.picker.Action.PICKED) {
		fileId = data.docs[0].id;
		closePrevious();
		document.getElementById('loader').style.display = 'block';
		realtimeUtils.load(fileId, onFileLoaded, onInitialize);
	}
	if(data.action == google.picker.Action.CANCEL)
	{
		clearCreatePopUp();
	}
}

// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });

// Loads after authentication
function start() {
	onGetNameHandler();
	app = {};
	registerTypes();
	
	newButton.classList.toggle('invisible', false);
	loadButton.classList.toggle('invisible', false);
	renameButton.classList.toggle('invisible', false);
	
	newButton.addEventListener('click', function () {
		renameButton.disabled = true;
		loadButton.disabled = true;
		document.getElementById('operationCreate').innerHTML = "Create";
		document.getElementById('file-name').value = "";
		document.getElementById('saveCreateButton').value = "Create";
		document.getElementById('saveCreateButton').onclick = createFile.bind(this);
		document.getElementById('cancelCreateButton').onclick = clearCreatePopUp.bind();
		document.getElementById('create-popUp').style.display = 'inline-block';
		document.getElementById('formBackground').style.display = 'block';
	});
	
	loadButton.addEventListener('click', function () {
		createPicker();
	});
	
	renameButton.addEventListener('click', function() {
		newButton.disabled = true;
		loadButton.disabled = true;
		if(fileId != null) {
			getName();
			changeFileName();
		}
		else {
			alert("No file has been selected");
			clearCreatePopUp();
		}
	});
}

// Creates a collaborative file and loads it
function createFile() {
	document.getElementById('loader').style.display = 'block';

	var fileName = document.getElementById('file-name').value;
	
	clearCreatePopUp();
	closePrevious();
	
	if(fileName != "") {
		realtimeUtils.createRealtimeFile(fileName, function(createResponse) {
			fileId = createResponse.id;
			realtimeUtils.load(createResponse.id, onFileLoaded, onInitialize);
		});
	}
	else {
		fileName = "Untitled";
		realtimeUtils.createRealtimeFile(fileName, function(createResponse) {
			fileId = createResponse.id;
			realtimeUtils.load(createResponse.id, onFileLoaded, onInitialize);
		});
	}
	
	fileName = "";
}

// Close previously open collaborative document
function closePrevious() {
	if(app.doc != null) {
		console.log("closing previous doc");
		app.doc.close()
	}
	if(network != null) {
		network.destroy();
	}
}

function onGetNameHandler() {
	gapi.client.load('drive','v2');
}

// Get the name of the file
function getName() {
	var request = gapi.client.drive.files.get({
		'fileId' : fileId
	});
	request.execute(function(resp) {
		name = resp.title;
		
		if(typeof name === 'undefined' || name === 'undefined') {
			return false;
		}
		fileName = name;
		displayFileName();
	});
}

// Opens form to change file name
function changeFileName() {
	document.getElementById('operationCreate').innerHTML = "Rename";
	document.getElementById('file-name').value = fileName;
	document.getElementById('saveCreateButton').value = "Update";
	document.getElementById('saveCreateButton').onclick = renameFile.bind(this, fileId);
	document.getElementById('cancelCreateButton').onclick = clearCreatePopUp.bind();
	document.getElementById('create-popUp').style.display = 'inline-block';
	document.getElementById('formBackground').style.display = 'block';
}

// Go into your google drive and rename file
function renameFile(fileId) {
	clearCreatePopUp();
	
	var newTitle = document.getElementById('file-name').value;
	var body = {
		'title': newTitle
	};
	var request = gapi.client.drive.files.update({
		'fileId': fileId,
		'resource': body
	});
	request.execute(function(resp) {
		console.log('New Title: ' + resp.title);
		getName();
	});
}

Node.prototype = {
	initialize: function(id, label, category, userInfo, userName, userEmail, location, url, description, group) {
		this.id = id;
		this.label = label;
		this.category = category;
		this.userInfo = userInfo;
		this.userName = userName;
		this.userEmail = userEmail;
		this.location = location;
		this.url = url;
		this.description = description;
		this.group = group;
	}
}

Edge.prototype = {
	initialize: function(id, from, to, label, qualitative, quantified, unit, unit2, unitOfMeasure, unitOfMeasure2, description) {
		this.id = id;
		this.from = from;
		this.to = to;
		this.label = label;
		this.qualitative = qualitative;
		this.quantified = quantified;
		this.unit = unit;
		this.unit2 = unit2;
		this.unitOfMeasure = unitOfMeasure;
		this.unitOfMeasure2 = unitOfMeasure2;
		this.description = description;
	}
}

// Registers each type of custom object before use
function registerTypes() {
	console.log("registering types...");
	
	var custom = gapi.drive.realtime.custom;
	
	custom.registerType(Node, 'objectNode');
	
	Node.prototype.id = custom.collaborativeField('id');
	Node.prototype.label = custom.collaborativeField('label');
	Node.prototype.category = custom.collaborativeField('category');
	Node.prototype.userInfo = custom.collaborativeField('userInfo');
	Node.prototype.userName = custom.collaborativeField('userName');
	Node.prototype.userEmail = custom.collaborativeField('userEmail');
	Node.prototype.location = custom.collaborativeField('location');
	Node.prototype.url = custom.collaborativeField('url');
	Node.prototype.description = custom.collaborativeField('description');
	Node.prototype.group = custom.collaborativeField('group');
	
	custom.setInitializer(Node, Node.prototype.initialize);
	
	custom.registerType(Edge, 'objectEdge');
	
	Edge.prototype.id = custom.collaborativeField('id');
	Edge.prototype.from = custom.collaborativeField('from');
	Edge.prototype.to = custom.collaborativeField('to');
	Edge.prototype.label = custom.collaborativeField('label');
	Edge.prototype.qualitative = custom.collaborativeField('qualitative');
	Edge.prototype.quantified = custom.collaborativeField('quantified');
	Edge.prototype.unit = custom.collaborativeField('unit');
	Edge.prototype.unit2 = custom.collaborativeField('unit2');
	Edge.prototype.unitOfMeasure = custom.collaborativeField('unitOfMeasure');
	Edge.prototype.unitOfMeasure2 = custom.collaborativeField('unitOfMeasure2');
	Edge.prototype.description = custom.collaborativeField('description');
	
	custom.setInitializer(Edge, Edge.prototype.initialize);
}

// Initialize the collaborative objects
function onInitialize(model) {
	console.log("initializing collaborative objects...");
	
	var objectNode = model.create(Node);
	var objectEdge = model.create(Edge);
	
	var listNodes = model.createList();
	var listEdges = model.createList();
	
	var stringEditName = model.createString();
	
	var stringRemoveNode = model.createString();
	var stringRemoveEdge = model.createString();
	
	model.getRoot().set('node_object', objectNode);
	model.getRoot().set('edge_object', objectEdge);
	
	model.getRoot().set('nodes_list', listNodes);
	model.getRoot().set('edges_list', listEdges);
	
	model.getRoot().set('name_string', stringEditName);
	
	model.getRoot().set('removeNode_string', stringRemoveNode);
	model.getRoot().set('removeEdge_string', stringRemoveEdge);
}

function onFileLoaded(doc) {
	console.log("file loading...");
	
	docModel = doc.getModel();
	app.doc = doc;
	
	app.objectNode = doc.getModel().getRoot().get('node_object');
	app.objectEdge = doc.getModel().getRoot().get('edge_object');
	
	app.listNodes = doc.getModel().getRoot().get('nodes_list');
	app.listEdges = doc.getModel().getRoot().get('edges_list');
	
	app.stringEditName = doc.getModel().getRoot().get('name_string');
	
	app.stringRemoveNode = doc.getModel().getRoot().get('removeNode_string');
	app.stringRemoveEdge = doc.getModel().getRoot().get('removeEdge_string');
	
	objNode = app.objectNode;
	objEdge = app.objectEdge;
	
	lstNodes = app.listNodes;
	lstEdges = app.listEdges;
	
	strEditName = app.stringEditName;
	
	strRemoveNode = app.stringRemoveNode;
	strRemoveEdge = app.stringRemoveEdge;
	
	setupLstNodes();
	setupLstEdges();
	
	setupStrEditName();
	
	setupStrRemoveNode();
	setupStrRemoveEdge();
	
	setupVis();
	
	document.getElementById('loader').style.display = 'none';
}

function setupLstNodes() {
	console.log("setting up list nodes...");
	
	this.lstNodes.addEventListener(
		gapi.drive.realtime.EventType.VALUES_ADDED,
	this.onLstNodesAdd);
	
	this.lstNodes.addEventListener(
		gapi.drive.realtime.EventType.VALUES_SET,
	this.onLstNodesEdit);
}

function setupLstEdges() {
	console.log("setting up list edges...");
	
	this.lstEdges.addEventListener(
		gapi.drive.realtime.EventType.VALUES_ADDED,
	this.onLstEdgesAdd);
	
	this.lstEdges.addEventListener(
		gapi.drive.realtime.EventType.VALUES_SET,
	this.onLstEdgesEdit);
}

function setupStrEditName() {
	console.log("setting up edit name...");
	
	this.strEditName.addEventListener(
		gapi.drive.realtime.EventType.TEXT_INSERTED,
	this.onStrEditNameChange);
}

function setupStrRemoveNode() {
	strRemoveNode.setText("");
	
	this.strRemoveNode.addEventListener(
		gapi.drive.realtime.EventType.TEXT_INSERTED,
	this.onStrRemoveNodeChange);
}

function setupStrRemoveEdge() {
	strRemoveEdge.setText("");
	
	this.strRemoveEdge.addEventListener(
		gapi.drive.realtime.EventType.TEXT_INSERTED,
	this.onStrRemoveEdgeChange);
}

// Adds nodes to local and nonlocal document
function onLstNodesAdd(evt) {
	console.log("lstNodes adding...");
	
	for(var i = 0; i < lstNodes.length; i++) {
		nodes.update(lstNodes.get(i));
		nodes.update(lstNodes.get(i));
	}
}

// Updates local and nonlocal nodes on canvas
function onLstNodesEdit(evt) {
	console.log("lstNodes editing...");
	
	var doesNodeExist = nodes.get(evt.newValues[0].id);
	console.log(doesNodeExist);
	
	if(doesNodeExist != null) {
		nodes.update({
			id:evt.newValues[0].id,
			label:evt.newValues[0].label,
			category:evt.newValues[0].category,
			userInfo:evt.newValues[0].userInfo,
			userName:evt.newValues[0].userName,
			userEmail:evt.newValues[0].userEmail,
			location:evt.newValues[0].location,
			url:evt.newValues[0].url,
			description:evt.newValues[0].description,
			group:evt.newValues[0].group
		});
	}
	else {
		console.log("Topic doesn't exist");
	}
}

// Adds edges to nonlocal document
function onLstEdgesAdd(evt) {
	console.log("lstEdges adding...");
	
	if(evt.isLocal){}
	else {
		for(var i = 0; i < lstEdges.length; i++) {
			edges.update(lstEdges.get(i));
		}
	}
}

// Updates nonlocal canvas with updated edges
function onLstEdgesEdit(evt) {
	console.log("lstEdge editing...");
	
	var doesEdgeExist = edges.get(evt.newValues[0].id);
	if(doesEdgeExist != null) {
		edges.update({
			id:evt.newValues[0].id,
			from:evt.newValues[0].from,
			to:evt.newValues[0].to,
			label:evt.newValues[0].label,
			qualitative:evt.newValues[0].qualitative,
			quantified:evt.newValues[0].quantified,
			unit:evt.newValues[0].unit,
			unit2:evt.newValues[0].unit2,
			unitOfMeasure:evt.newValues[0].unitOfMeasure,
			unitOfMeasure2:evt.newValues[0].unitOfMeasure2,
			description:evt.newValues[0].description
		});
	}
	else {
		console.log("Relationship doesn't exist");
	}
}

// Edits the name on the nonlocal document
function onStrEditNameChange(evt) {
	if(evt.isLocal) {}
	else {
		console.log("Change file name");
		getName();
	}
}

// Remove node from Collaborative list
function onStrRemoveNodeChange(evt) {
	console.log("removing node...");
	
	var removeEdges = network.getConnectedEdges(strRemoveNode.text);
	
	nodes.remove(strRemoveNode.text);
	
	for(var i = 0; i < lstEdges.length; i++) {
		for(var j = 0; j < removeEdges.length; j++) {
			var removeEdge = removeEdges[j];
			
			if(lstEdges.get(i).id == removeEdge) {
				lstEdges.remove(i);
			}
		}
	}
	for(var i = 0; i < lstNodes.length; i++) {
		if(lstNodes.get(i).id == strRemoveNode.text) {
			lstNodes.remove(i);
		}
	}
}

// Remove edge from Collaborative list
function onStrRemoveEdgeChange(evt) {
	console.log("removing edge...");
	
	edges.remove(strRemoveEdge.text);
	
	for(var i = 0; i < lstEdges.length; i++) {
		if(lstEdges.get(i).id == strRemoveEdge.text) {
			lstEdges.remove(i);
		}
	}
}

// Share the file
function initDriveShare() {
	if(fileId != "" && fileId != null && !this.ShareClient) {
		try{
			s = new gapi.drive.share.ShareClient();
			s.setOAuthToken(oauthToken);
			s.setItemIds([fileId]);
			
			s.showSettingsDialog();
		}
		catch(err) {
			alert(err);
		}
	}
}

function setupCollaborativeStrings() {
	this.strLabel.addEventListener(
      gapi.drive.realtime.EventType.TEXT_INSERTED,
      this.onStrLabelEvent);
	  
    this.strLabel.addEventListener(
      gapi.drive.realtime.EventType.TEXT_DELETED,
      this.onStrLabelEvent);
}

function onStrLabelEvent(evt) {
	document.getElementById(this.labelName).value = this.strLabel.getText();
}

function onStrLabelChange(evt) {
	this.strLabel.setText(document.getElementById(this.labelName).value);
}

function setupNodeObject() {
	console.log("setting up");
	
	this.newNode.addEventListener(
		gapi.drive.realtime.EventType.VALUE_CHANGED,
	this.onCustomObjectChange);
}

// Event Listener to change Non local events and add nodes to list
function onCustomObjectChange(evt) {
	if(evt.isLocal) {
		console.log("local event...");
	}
	else {
		console.log("nonlocal event...");
		
		if(newNode.id == nodeId) {
			document.getElementById(this.categoryName).value = this.newNode.category;
			document.getElementById(this.userInfoName).value = this.newNode.userInfo;
			document.getElementById(this.labelName).value = this.newNode.label;
			document.getElementById(this.urlName).value = this.newNode.url;
			document.getElementById(this.descriptionName).value = this.newNode.description;
			document.getElementById(this.locationName).value = this.newNode.location;
			document.getElementById(this.userName).value = this.newNode.userName;
			document.getElementById(this.userEmailName).value = this.newNode.userEmail;
		}
	}
	
	for(var i = 0; i < lstNodes.length; i++) {
		if(lstNodes.get(i).id == newNode.id) {
			lstNodes.set(i, {
				id:newNode.id,
				label:newNode.label,
				category:newNode.category,
				userInfo:newNode.userInfo,
				userName:newNode.userName,
				userEmail:newNode.userEmail,
				location:newNode.location,
				url:newNode.url,
				description:newNode.description,
				group:newNode.group
			});
			break;
		}
	}
}

function onCategoryInputChange() {
	console.log("category changing");
	
	this.newNode.category = document.getElementById(this.categoryName).value;
	console.log(newNode.category);
}

function onMapInputChange() {
	console.log("Map type changing");
	
	this.newNode.userInfo = document.getElementById(this.userInfoName).value;
	console.log(newNode.userInfo);
}

function onLabelInputChange() {
	console.log("label changing");
	
	this.newNode.label = document.getElementById(this.labelName).value;
	console.log(newNode.label);
}

function onUrlInputChange() {
	console.log("url changing");
	
	this.newNode.url = document.getElementById(this.urlName).value;
	console.log(newNode.url);
}

function onDescriptionInputChange() {
	console.log("description changing");
	
	this.newNode.description = document.getElementById(this.descriptionName).value;
	console.log(newNode.description);
}

function onLocationInputChange() {
	console.log("location changing");
	
	this.newNode.location = document.getElementById(this.locationName).value;
	console.log(newNode.location);
}

function onUserNameInputChange() {
	console.log("username changing");
	
	this.newNode.userName = document.getElementById(this.userName).value;
	console.log(newNode.userName);
}

function onUserEmailInputChange() {
	console.log("userEmail changing");
	
	this.newNode.userEmail = document.getElementById(this.userEmailName).value;
	console.log(newNode.userEmail);
}

function setupEdgeObject() {
	console.log("setting up");
	this.newEdge.addEventListener(
		gapi.drive.realtime.EventType.VALUE_CHANGED,
	this.onEdgeCustomObjectChange);
}

// Event Listener to change Non local events and add edges to list
function onEdgeCustomObjectChange(evt) {
	if(evt.isLocal) {
		console.log("local event...");
	}
	else {
		console.log("nonlocal event...");
		if(newEdge.id == edgeId) {
			document.getElementById(this.edgeLabelName).value = this.newEdge.label;
			document.getElementById(this.qualitativeName).value = this.newEdge.qualitative;
			document.getElementById(this.quantifiedName).value = this.newEdge.quantified;
			document.getElementById(this.unitName).value = this.newEdge.unit;
			document.getElementById(this.unit2Name).value = this.newEdge.unit2;
			document.getElementById(this.unitOfMeasureName).value = this.newEdge.unitOfMeasure;
			document.getElementById(this.unitOfMeasure2Name).value = this.newEdge.unitOfMeasure2;
			document.getElementById(this.edgeDescriptionName).value = this.newEdge.description;
		}
	}
	
	for(var i = 0; i < lstEdges.length; i++) {
		if(lstEdges.get(i).id == newEdge.id) {
			lstEdges.set(i,{
				id:newEdge.id,
				from:newEdge.from,
				to:newEdge.to,
				label:newEdge.label,
				qualitative:newEdge.qualitative,
				quantified:newEdge.quantified,
				unit:newEdge.unit,
				unit2:newEdge.unit2,
				unitOfMeasure:newEdge.unitOfMeasure,
				unitOfMeasure2:newEdge.unitOfMeasure2,
				description:newEdge.description
			});
			break;
		}
	}
	
	syncUnitOfMeasure();
}

function onEdgeLabelInputChange() {
	console.log("label changing");
	
	this.newEdge.label = document.getElementById(this.edgeLabelName).value;
	console.log(newEdge.label);
}

function onEdgeQualitativeInputChange() {
	console.log("qualitative changing");
	
	this.newEdge.qualitative = document.getElementById(this.qualitativeName).value;
	console.log(newEdge.qualitative);
}

function onEdgeQuantifiedInputChange() {
	console.log("quantified changing");
	
	this.newEdge.quantified = document.getElementById(this.quantifiedName).value;
	console.log(newEdge.quantified);
}

function onEdgeUnitInputChange() {
	console.log("unit changing");
	
	this.newEdge.unit = document.getElementById(this.unitName).value;
	console.log(newEdge.unit);
}

function onEdgeUnit2InputChange() {
	console.log("unit2 changing");
	
	this.newEdge.unit2 = document.getElementById(this.unit2Name).value;
	console.log(newEdge.unit2);
}

function onEdgeUnitOfMeasureInputChange() {
	console.log("unitOfMeasure changing");
	
	this.newEdge.unitOfMeasure = document.getElementById(this.unitOfMeasureName).value;
	console.log(newEdge.unitOfMeasure);
}

function onEdgeUnitOfMeasure2InputChange() {
	console.log("unitOfMeasure2 changing");
	
	this.newEdge.unitOfMeasure2 = document.getElementById(this.unitOfMeasure2Name).value;
	console.log(newEdge.unitOfMeasure2);
}

function onEdgeDescriptionInputChange() {
	console.log("description changing");
	
	this.newEdge.description = document.getElementById(this.edgeDescriptionName).value;
	console.log(newEdge.description);
}