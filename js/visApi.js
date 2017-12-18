var nodeId;
var edgeId;

var categoryName;
var userInfoName;
var labelName;
var urlName;
var descriptionName;
var locationName;
var userName;
var userEmailName;

var edgeLabelName;
var qualitativeName;
var quantifiedName;
var unitName;
var unitOfMeasureName;
var unit2Name;
var unitOfMeasure2Name;
var edgeDescriptionName;

var newNode;
var newEdge;

var forEditingDescription;
var forEditingQualitative;
var forEditingQuantified;
var forEditingUnit;
var forEditingUnitOfMeasure;
var forEditingUnit2;
var forEditingUnitOfMeasure2;
var selectedGroup = null;
var add = false;
var hidingNodes = false;

var nodes;
var edges;

const MAIN_COLOR = '#583432';
const SUB1_COLOR = '#754642';
const SUB2_COLOR = '#925752';
const SUB3_COLOR = '#A86D69';
const SUB4_COLOR = '#B98A87';
const SUB5_COLOR = '#CBA7A5';
const SUB6_COLOR = '#443242';
const SUB7_COLOR = '#5A4358';
const SUB8_COLOR = '#70536E';
const SUB9_COLOR = '#876984';
const SUB10_COLOR = '#9F879C';
const SUB11_COLOR = '#B7A5B5';
const SUB12_COLOR = '#3E3259';
const SUB13_COLOR = '#524276';
const SUB14_COLOR = '#665294';
const SUB15_COLOR = '#7D69AA';
const SUB16_COLOR = '#9787BB';
const SUB17_COLOR = '#B1A5CC';
const SUB18_COLOR = '#3B4D45';
const SUB19_COLOR = '#4E665B';
const SUB20_COLOR = '#628072';
const SUB21_COLOR = '#789688';
const SUB22_COLOR = '#93ABA0';
const SUB23_COLOR = '#AEC0B8';
const SUB24_COLOR = '#5D5D2E';
const SUB25_COLOR = '#7C7C3D';
const SUB26_COLOR = '#9B9B4C';
const SUB27_COLOR = '#B1B162';
const SUB28_COLOR = '#C1C181';
const SUB29_COLOR = '#D0D0A1';

var data;
var container;
var options;
var network;

function setupVis() {
	console.log("setting up vis");
	getName();
	
	nodes = new vis.DataSet(lstNodes.asArray());
	edges = new vis.DataSet(lstEdges.asArray());
	
	// Instantiate our network object.
	container = document.getElementById('mynetwork');
	
	data = {
		nodes: nodes,
		edges: edges
	};
	
	options = {
		groups: {
			main: {
				color: MAIN_COLOR
			},
			sub1: {
				color: SUB1_COLOR
			},
			sub2: {
				color: SUB2_COLOR
			},
			sub3: {
				color: SUB3_COLOR
			},
			sub4: {
				color: SUB4_COLOR
			},
			sub5: {
				color: SUB5_COLOR
			},
			sub6: {
				color: SUB6_COLOR
			},
			sub7: {
				color: SUB7_COLOR
			},
			sub8: {
				color: SUB8_COLOR
			},
			sub9: {
				color: SUB9_COLOR
			},
			sub10: {
				color: SUB10_COLOR
			},
			sub11: {
				color: SUB11_COLOR
			},
			sub12: {
				color: SUB12_COLOR
			},
			sub13: {
				color: SUB13_COLOR
			},
			sub14: {
				color: SUB14_COLOR
			},
			sub15: {
				color: SUB15_COLOR
			},
			sub16: {
				color: SUB16_COLOR
			},
			sub17: {
				color: SUB17_COLOR
			},
			sub18: {
				color: SUB18_COLOR
			},
			sub19: {
				color: SUB19_COLOR
			},
			sub20: {
				color: SUB20_COLOR
			},
			sub21: {
				color: SUB21_COLOR
			},
			sub22: {
				color: SUB22_COLOR
			},
			sub23: {
				color: SUB23_COLOR
			},
			sub24: {
				color: SUB24_COLOR
			},
			sub25: {
				color: SUB25_COLOR
			},
			sub26: {
				color: SUB26_COLOR
			},
			sub27: {
				color: SUB27_COLOR
			},
			sub28: {
				color: SUB28_COLOR
			},
			sub29: {
				color: SUB29_COLOR
			}
		},
		nodes: {
			font: {
				size: 18
			},
			shape: 'dot',
			scaling: {
				label: {
					enabled: true
				}
			}
		},
		edges: {
			smooth: {
				enabled: false
			}
		},
		physics: {
			enabled: false
		},
		layout: {
			hierarchical: {
				enabled: true,
				direction: 'LR',
				levelSeparation: 250,
				treeSpacing: 400,
				nodeSpacing: 250,
				edgeMinimization: true,
				blockShifting: true,
				sortMethod: "directed"
			}
		},
		interaction: {
			navigationButtons: true,
			dragNodes: false
		},
		manipulation: {
			addNode: function (data, callback) {
				var nodeGroup;
				add = true;
				data.group = selectGroup(nodeGroup);
				
				document.getElementById('display_container').style.display = 'none';
				document.getElementById('sideNodeDisplay').style.display = 'none';
				
				if(data.group == null) {
					alert("You've reached the end of the hierarchy!");
					callback(null);
				}
				else {
					// filling in the popup DOM elements
					document.getElementById('operationNode').innerHTML = "Add Topic";
					document.getElementById('node-label').value = data.label;
					document.getElementById('node-category').value = data.category;
					document.getElementById('node-userInfo').value = "";
					document.getElementById('node-userName').value = "";
					document.getElementById('node-userEmail').value = "";
					document.getElementById('node-location').value = "";
					document.getElementById('node-url').value = "";
					document.getElementById('node-description').value = "";
					document.getElementById('saveNodeButton').value = "Add";
					document.getElementById('saveNodeButton').onclick = saveAddNodeData.bind(this, data, callback);
					document.getElementById('cancelNodeButton').style.display = "inline";
					document.getElementById('cancelNodeButton').onclick = clearNodePopUp.bind();
					document.getElementById('network-NodepopUp').style.display = 'inline-block';
					document.getElementById('formBackground').style.display = 'block';
					loadButton.disabled = true;
					newButton.disabled = true;
					renameButton.disabled = true;
				}
			},
			editNode: function (data, callback) {
				categoryName = "category-"+data.id;
				userInfoName = "userInfo-"+data.id;
				labelName = "label-"+data.id;
				urlName = "url-"+data.id;
				descriptionName = "description-"+data.id;
				locationName = "location-"+data.id;
				userName = "userName-"+data.id;
				userEmailName = "userEmail-"+data.id;
				
				document.getElementById('display_container').style.display = 'none';
				document.getElementById('sideNodeDisplay').style.display = 'none';
				
				if(doc.getModel().getRoot().get(data.id) == null) {
					newNode = docModel.create(Node, data.id, data.label, data.category, data.userInfo, data.userName, data.userEmail, data.location, data.url, data.description, data.group);
					
					docModel.getRoot().set(data.id, newNode);
				}
				else {
					console.log("already created");
					newNode = doc.getModel().getRoot().get(data.id);
				}
				
				setupNodeObject();
				
				// filling in the popup DOM elements
				document.getElementById('operationNode').innerHTML = "Edit Topic";
				
				document.getElementById('node-category').id = categoryName;
				document.getElementById(categoryName).value = newNode.category;
				
				document.getElementById('node-userInfo').id = userInfoName;
				document.getElementById(userInfoName).value = newNode.userInfo;
				
				document.getElementById('node-label').id = labelName;
				document.getElementById(labelName).value = newNode.label;
				
				document.getElementById('node-url').id = urlName;
				document.getElementById(urlName).value = newNode.url;
				
				document.getElementById('node-description').id = descriptionName;
				document.getElementById(descriptionName).value = newNode.description;
				
				document.getElementById('node-location').id = locationName;
				document.getElementById(locationName).value = newNode.location;
				
				document.getElementById('node-userName').id = userName;
				document.getElementById(userName).value = newNode.userName;
				
				document.getElementById('node-userEmail').id = userEmailName;
				document.getElementById(userEmailName).value = newNode.userEmail;
				
				document.getElementById('saveNodeButton').value = "Close";
				document.getElementById('saveNodeButton').onclick = saveEditNodeData.bind(this, data, callback);
				
				document.getElementById('cancelNodeButton').style.display = "none";
				//document.getElementById('cancelNodeButton').onclick = cancelNodeEdit.bind(this, callback);
				document.getElementById('network-NodepopUp').style.display = 'inline-block';
				document.getElementById('formBackground').style.display = 'block';
				loadButton.disabled = true;
				newButton.disabled = true;
				renameButton.disabled = true;
			},
			deleteNode: function (data, callback) {
				console.log("deleting node: " + JSON.stringify(data));
				var connections = network.getConnectedNodes(nodeId, "to");
				
				document.getElementById('display_container').style.display = 'none';
				document.getElementById('sideNodeDisplay').style.display = 'none';
				
				if(connections.length == 0) {
					var deleteOne = confirm("You are deleting the Topic!");
					
					if(deleteOne == true) {
						strRemoveNode.setText(nodeId);
						
						callback(null);
					}
					else {
						callback(null);
					}
				} 
				else {
					var deleteAll = confirm("Delete this Topic and all Sub Topics!");
					
					if(deleteAll == true) {
						deleteThisNodeAndSubNodes();
					}
					else {}
					callback(null);
				}
			},
			addEdge: false,
			editEdge: {
				editWithoutDrag: function (data, callback) {
					edgeLabelName = "edgelabel-"+data.id;
					qualitativeName = "qualitative-"+data.id;
					quantifiedName = "quantified-"+data.id;
					unitName = "unit-"+data.id;
					unitOfMeasureName = "unitOfMeasure-"+data.id;
					unit2Name = "unit2-"+data.id;
					unitOfMeasure2Name = "unitOfMeasure2-"+data.id;
					edgeDescriptionName = "edgedescription-"+data.id;
					
					document.getElementById('display_container').style.display = 'none';
					document.getElementById('sideEdgeDisplay').style.display = 'none';
					
					if(doc.getModel().getRoot().get(data.id) == null) {
						newEdge = docModel.create(Edge, data.id);
						
						docModel.getRoot().set(data.id, newEdge);
					}
					else {
						console.log("already created");
						newEdge = doc.getModel().getRoot().get(data.id);
					}
					
					if(typeof data.to === 'object') {
						data.to = data.to.id
					}
					if(typeof data.from === 'object') {
						data.from = data.from.id
					}
					
					newEdge.label = data.label;
					newEdge.from = data.from;
					newEdge.to = data.to;
					newEdge.qualitative = forEditingQualitative;
					newEdge.quantified = forEditingQuantified;
					newEdge.unit = forEditingUnit;
					newEdge.unit2 = forEditingUnit2;
					newEdge.unitOfMeasure = forEditingUnitOfMeasure;
					newEdge.unitOfMeasure2 = forEditingUnitOfMeasure2;
					newEdge.description = forEditingDescription;
					
					setupEdgeObject();
					
					// filling in the popup DOM elements
					document.getElementById('operationEdge').innerHTML = "Edit Relationship";
					
					document.getElementById('edge-label').id = edgeLabelName;
					document.getElementById(edgeLabelName).value = data.label;
					
					document.getElementById('edge-qualitative').id = qualitativeName;
					document.getElementById(qualitativeName).value = forEditingQualitative;
					
					document.getElementById('edge-quantified').id = quantifiedName;
					document.getElementById(quantifiedName).value = forEditingQuantified;
					
					document.getElementById('edge-unit').id = unitName;
					document.getElementById(unitName).value = forEditingUnit;
					
					document.getElementById('edge-unit2').id = unit2Name;
					document.getElementById(unit2Name).value = forEditingUnit2;
					
					document.getElementById('edge-unitOfMeasure').id = unitOfMeasureName;
					document.getElementById(unitOfMeasureName).value = forEditingUnitOfMeasure;
					
					document.getElementById('edge-unitOfMeasure2').id = unitOfMeasure2Name;
					document.getElementById(unitOfMeasure2Name).value = forEditingUnitOfMeasure2;
					
					document.getElementById('edge-description').id = edgeDescriptionName;
					document.getElementById(edgeDescriptionName).value = forEditingDescription;
					
					syncUnitOfMeasure();
					
					//document.getElementById('saveEdgeButton').value = "Close";
					document.getElementById('saveEdgeButton').onclick = saveEditEdgeData.bind(this, data, callback);
					//document.getElementById('cancelEdgeButton').onclick = cancelEdgeEdit.bind(this,callback);
					document.getElementById('network-EdgepopUp').style.display = 'inline-block';
					document.getElementById('formBackground').style.display = 'block';
					loadButton.disabled = true;
					newButton.disabled = true;
					renameButton.disabled = true;
				}
			},
			deleteEdge: false
		}
	};
	
	network = new vis.Network(container, data, options);
	
	// Get Node id or Edge id of selected
	network.on("click", function(params) {
		if(params.nodes.length == 1) {
			nodeId = params.nodes[0];
			selectedGroup = data.nodes._data[nodeId].group;
			
			sideDisplayNodeInfo();
		}
		else {
			document.getElementById('display_container').style.display = 'none';
			document.getElementById('sideNodeDisplay').style.display = 'none';
			nodeId = null;
			selectedGroup = null;
		}
		
		if(params.edges.length == 1 && params.nodes.length != 1) {
			edgeId = params.edges[0];
			
			forEditingDescription = data.edges._data[edgeId].description;
			forEditingQualitative = data.edges._data[edgeId].qualitative;
			forEditingQuantified = data.edges._data[edgeId].quantified;
			forEditingUnit = data.edges._data[edgeId].unit;
			forEditingUnit2 = data.edges._data[edgeId].unit2;
			forEditingUnitOfMeasure = data.edges._data[edgeId].unitOfMeasure;
			forEditingUnitOfMeasure2 = data.edges._data[edgeId].unitOfMeasure2;
			
			sideDisplayEdgeInfo();
		}
		else {
			document.getElementById('sideEdgeDisplay').style.display = 'none';
		}
	});
	
	// if we doubleclick on a node we want it to hide and show its sub nodes
	// network.on("doubleClick", function (params) {
		// if(params.nodes.length == 1) {
			// //clusterByConnection();
			// hideNodes();
		// }
	// });
}

function displayFileName() {
	strEditName.setText(fileName);
	document.getElementById('displayFileName').innerHTML = fileName;
}

function sideDisplayNodeInfo() {
	document.getElementById('node-sideCategory').innerHTML = data.nodes._data[nodeId].category;
	document.getElementById('node-sideUserInfo').innerHTML = data.nodes._data[nodeId].userInfo;
	document.getElementById('node-sideName').innerHTML = data.nodes._data[nodeId].label;
	document.getElementById('node-sideUserName').innerHTML = data.nodes._data[nodeId].userName;
	document.getElementById('node-sideUserEmail').innerHTML = data.nodes._data[nodeId].userEmail;
	
	var xlink = data.nodes._data[nodeId].url;
	var x = document.getElementById('node-sideLink');
  
	if(!/^https?:\/\//i.test(xlink)) {
		x.innerHTML = "<a href='http://" + xlink + "' target='_blank'>" + xlink + "</a>";
	}
	else {
		x.innerHTML = "<a href='" + xlink + "' target='_blank'>" + xlink + "</a>";
	}
	document.getElementById('node-sideDescription').innerHTML = data.nodes._data[nodeId].description;
	document.getElementById('node-sideLocation').innerHTML = data.nodes._data[nodeId].location;
	document.getElementById('display_container').style.display = 'inline-block';
	document.getElementById('sideNodeDisplay').style.display = 'inline-block';
}

function afterSideDisplayNodeInfo(data) {
	var xlink = data.url;
	var x = document.getElementById('node-sideLink');
  
	if(!/^https?:\/\//i.test(xlink)) {
		x.innerHTML = "<a href='http://" + xlink + "' target='_blank'>" + xlink + "</a>";
	}
	else{
		x.innerHTML = "<a href='" + xlink + "' target='_blank'>" + xlink + "</a>";
	}

	document.getElementById('node-sideCategory').innerHTML = data.category;
	document.getElementById('node-sideName').innerHTML = data.label;
	document.getElementById('node-sideUserInfo').innerHTML = data.userInfo;
	document.getElementById('node-sideUserName').innerHTML = data.userName;
	document.getElementById('node-sideUserEmail').innerHTML = data.userEmail;
	document.getElementById('node-sideDescription').innerHTML = data.description;
	document.getElementById('node-sideLocation').innerHTML = data.location;
}
	
function sideDisplayEdgeInfo() {
	document.getElementById('edge-sideName').innerHTML = data.edges._data[edgeId].label;
	document.getElementById('edge-sideDescription').innerHTML = data.edges._data[edgeId].description;
	document.getElementById('edge-sideQualitative').innerHTML = data.edges._data[edgeId].qualitative;
	document.getElementById('edge-sideQuantified').innerHTML = data.edges._data[edgeId].quantified;
	document.getElementById('edge-sideUnit').innerHTML = data.edges._data[edgeId].unit;
	document.getElementById('edge-sideUnit2').innerHTML = data.edges._data[edgeId].unit2;
	document.getElementById('edge-sideUnitOfMeasure').innerHTML = data.edges._data[edgeId].unitOfMeasure;
	document.getElementById('edge-sideUnitOfMeasure2').innerHTML = data.edges._data[edgeId].unitOfMeasure2;
	document.getElementById('display_container').style.display = 'inline-block';
	document.getElementById('sideEdgeDisplay').style.display = 'inline-block';
}

function afterSideDisplayEdgeInfo(data) {
	document.getElementById('edge-sideName').innerHTML = data.label;
	document.getElementById('edge-sideQualitative').innerHTML = data.qualitative;
	document.getElementById('edge-sideQuantified').innerHTML = data.quantified;
	document.getElementById('edge-sideUnit').innerHTML = data.unit;
	document.getElementById('edge-sideUnit2').innerHTML = data.unit2;
	document.getElementById('edge-sideUnitOfMeasure').innerHTML = data.unitOfMeasure;
	document.getElementById('edge-sideUnitOfMeasure2').innerHTML = data.unitOfMeasure2;
	document.getElementById('edge-sideDescription').innerHTML = data.description;
}

// hide and show nodes
function hideNodes() {
	var hideNodes = network.getConnectedNodes(nodeId, 'to'); // main array of connected ids
	
	for(var i = 0; i < hideNodes.length; i++) {
		var hideNode = hideNodes[i];
		
		if(data.nodes._data[hideNode].hidden == false || data.nodes._data[hideNode].hidden == null) {
			hidingNodes = false;
		}
		else {
			hidingNodes = true;
		}
	}
	if(hidingNodes == true) {
		showConnectedNodes(hideNodes);
	}
	else if(hidingNodes == false) {
		hideConnectedNodes(hideNodes);
	}
}

// show nodes one level down
function showConnectedNodes(hideNodes) {
	for(var i = 0; i < hideNodes.length; i++) {
		var hideNode = hideNodes[i];
		
		var hideConnectedNodes = network.getConnectedNodes(hideNode, 'to');
		
		for(var j = 0; j < hideConnectedNodes.length; j++) {
			var hideConnectedNode = hideConnectedNodes[j];
			hideNodes.push(hideConnectedNode);
		}
		nodes.update({
			id:hideNode,
			hidden:false
		});
	}
}

// hide all nodes below selected node
function hideConnectedNodes(hideNodes) {
	for(var i = 0; i < hideNodes.length; i++) {
		var hideNode = hideNodes[i];
		
		var hideConnectedNodes = network.getConnectedNodes(hideNode, 'to');
		
		for(var j = 0; j < hideConnectedNodes.length; j++) {
			var hideConnectedNode = hideConnectedNodes[j];
			hideNodes.push(hideConnectedNode);
		}
		nodes.update({
			id: hideNode, 
			hidden: true
		});
	}
}

function objectToArray(obj) {
	return Object.keys(obj).map(function (key) {
		obj[key].id = key;
		return obj[key];
	});
}

// Assign groups to nodes
function selectGroup(nodeGroup) {
	if(selectedGroup != null){
		if(selectedGroup == 'sub29') {
			nodeGroup = 'sub29';
		}
		if(selectedGroup == 'sub28') {
			nodeGroup = 'sub29';
		}
		if(selectedGroup == 'sub27') {
			nodeGroup = 'sub28';
		}
		if(selectedGroup == 'sub26') {
			nodeGroup = 'sub27';
		}
		if(selectedGroup == 'sub25') {
			nodeGroup = 'sub26';
		}
		if(selectedGroup == 'sub24') {
			nodeGroup = 'sub25';
		}
		if(selectedGroup == 'sub23') {
			nodeGroup = 'sub24';
		}
		if(selectedGroup == 'sub22') {
			nodeGroup = 'sub23';
		}
		if(selectedGroup == 'sub21') {
			nodeGroup = 'sub22';
		}
		if(selectedGroup == 'sub20') {
			nodeGroup = 'sub21';
		}
		if(selectedGroup == 'sub19') {
			nodeGroup = 'sub20';
		}
		if(selectedGroup == 'sub18') {
			nodeGroup = 'sub19';
		}
		if(selectedGroup == 'sub17') {
			nodeGroup = 'sub18';
		}
		if(selectedGroup == 'sub16') {
			nodeGroup = 'sub17';
		}
		if(selectedGroup == 'sub15') {
			nodeGroup = 'sub16';
		}
		if(selectedGroup == 'sub14') {
			nodeGroup = 'sub15';
		}
		if(selectedGroup == 'sub13') {
			nodeGroup = 'sub14';
		}
		if(selectedGroup == 'sub12') {
			nodeGroup = 'sub13';
		}
		if(selectedGroup == 'sub11') {
			nodeGroup = 'sub12';
		}
		if(selectedGroup == 'sub10') {
			nodeGroup = 'sub11';
		}
		if(selectedGroup == 'sub9') {
			nodeGroup = 'sub10';
		}
		if(selectedGroup == 'sub8') {
			nodeGroup = 'sub9';
		}
		if(selectedGroup == 'sub7') {
			nodeGroup = 'sub8';
		}
		if(selectedGroup == 'sub6') {
			nodeGroup = 'sub7';
		}
		if(selectedGroup == 'sub5') {
			nodeGroup = 'sub6';
		}
		if(selectedGroup == 'sub4') {
			nodeGroup = 'sub5';
		}
		if(selectedGroup == 'sub3') {
			nodeGroup = 'sub4';
		}
		if(selectedGroup == 'sub2') {
			nodeGroup = 'sub3';
		}
		if(selectedGroup == 'sub1') {
			nodeGroup = 'sub2';
		}
		if(selectedGroup == 'main') {
			nodeGroup = 'sub1';
		}
	}
	else {
		nodeGroup = 'main';
	}
	return nodeGroup;
}

// Find group of selected node
function findGroup(findFrom, findTo) {
	if(data.nodes._data[findFrom].group == data.nodes._data[findTo].group){
		console.log("in same group");
		
		if(data.nodes._data[findFrom].group != "main") {
			var notMain = "notMain";
			
			return notMain;
		}
		return true;
	}
	else {
		return false;
	}
}

// Adds node to local and collaborative document
function saveAddNodeData(data, callback) {
	var requiredTopicName;
	var requiredCategory;
	var topicNameBool = false;
	var categoryBool = false;
	var nodeExists = false;
	var checkThisNode;
	
	checkThisNode = nodes.get(nodeId);
	
	if(checkThisNode == null) {
		nodeExists = false;
	}
	else {
		nodeExists = true;
	}
	if(document.getElementById('node-label').value == null || document.getElementById('node-label').value == "") {
		topicNameBool = true;
		requiredTopicName = "Topic name required!";
	}
	else {
		topicNameBool = false;
	}
	if(document.getElementById('node-category').value == null || document.getElementById('node-category').value == "") {
		categoryBool = true;
		requiredCategory = "Category required!";
	}
	else {
		categoryBool = false;
	}
	
	if(topicNameBool == false && categoryBool == false && nodeExists == true) {
		data.label = document.getElementById('node-label').value;
		data.category = document.getElementById('node-category').value;
		data.userInfo = document.getElementById('node-userInfo').value;
		data.userName = document.getElementById('node-userName').value;
		data.userEmail = document.getElementById('node-userEmail').value;
		data.location = document.getElementById('node-location').value;
		data.url = document.getElementById('node-url').value;
		data.description = document.getElementById('node-description').value;
		
		docModel.beginCompoundOperation();
		objNode.id = data.id;
		objNode.label = data.label;
		objNode.category = data.category;
		objNode.userInfo = data.userInfo;
		objNode.userName = data.userName;
		objNode.userEmail = data.userEmail;
		objNode.location = data.location;
		objNode.url = data.url;
		objNode.description = data.description;
		objNode.group = data.group;
		docModel.endCompoundOperation();
		
		lstNodes.push({
			id:objNode.id,
			label:objNode.label,
			category:objNode.category,
			userInfo:objNode.userInfo,
			userName:objNode.userName,
			userEmail:objNode.userEmail,
			location:objNode.location,
			url:objNode.url,
			description:objNode.description,
			group:objNode.group
		});
		
		clearNodePopUp();
		
		callback(null);
		
		if(nodeId != null && add == true) {
			addEdgeToCreatedNode(data);
		}
		add = false;
	}
	else {
		if(topicNameBool == false && categoryBool == true) {
			alert(requiredCategory);
		}
		if(topicNameBool == true && categoryBool == false) {
			alert(requiredTopicName);
		}
		if(topicNameBool == true && categoryBool == true) {
			alert(requiredCategory + "\n" + requiredTopicName);
		}
		if(nodeExists == false) {
			alert("This Topic doesn't exist!");
			
			clearNodePopUp();
			callback(null);
		}
	}
}

// Edits node on local and collaborative document
function saveEditNodeData(data, callback) {
	var requiredTopicName;
	var requiredCategory;
	var topicNameBool = false;
	var categoryBool = false;
	var doesNodeExist = nodes.get(nodeId);
	
	if(doesNodeExist != null) {
		if(document.getElementById(labelName).value == null || document.getElementById(labelName).value == "") {
			topicNameBool = true;
			requiredTopicName = "Topic name required!";
		}
		else {
			topicNameBool = false;
		}
		if(document.getElementById(categoryName).value == null || document.getElementById(categoryName).value == "") {
			categoryBool = true;
			requiredCategory = "Category required!";
		}
		else {
			categoryBool = false;
		}
		if(topicNameBool == false && categoryBool == false) {
			document.getElementById(categoryName).id = "node-category";
			document.getElementById(userInfoName).id = "node-userInfo";
			document.getElementById(labelName).id = "node-label";
			document.getElementById(urlName).id = "node-url";
			document.getElementById(descriptionName).id = "node-description";	
			document.getElementById(locationName).id = "node-location";
			document.getElementById(userName).id = "node-userName";
			document.getElementById(userEmailName).id = "node-userEmail";
			
			clearNodePopUp();
			
			callback(null);
			afterSideDisplayNodeInfo(data);
		}
		else {
			if(topicNameBool == false && categoryBool == true) {
				alert(requiredCategory);
			}
			if(topicNameBool == true && categoryBool == false) {
				alert(requiredTopicName);
			}
			if(topicNameBool == true && categoryBool == true) {
				alert(requiredCategory + "\n" + requiredTopicName);
			}
		}
	}
	else {
		alert("Topic doesn't exist");
		clearNodePopUp();
	}
}

// Deletes the selected node and sub nodes
function deleteThisNodeAndSubNodes() {
	console.log("deleting nodes...");
	var removeNodes = network.getConnectedNodes(nodeId, 'to');
	
	for(var i = 0; i < removeNodes.length; i++) {
		var removeNode = removeNodes[i];
		
		var removeConnectedNodes = network.getConnectedNodes(removeNode, 'to');
		
		for(var j = 0; j < removeConnectedNodes.length; j++) {
			var removeConnectedNode = removeConnectedNodes[j];
			removeNodes.push(removeConnectedNode);
		}
		strRemoveNode.setText(removeNode);
		nodes.remove(removeNode);
	}
	
	strRemoveNode.setText(nodeId);
	nodes.remove(nodeId);
}

// Creates an edge when the Node is created
function addEdgeToCreatedNode(data) {
	var addedEdge = edges.add({
						from:nodeId,
						to:data.id,
						label:"",
						qualitative:"",
						quantified:"",
						unit:"",
						unit2:"",
						unitOfMeasure:"",
						unitOfMeasure2:"",
						description:""
					});
	
	docModel.beginCompoundOperation();
	objEdge.id = addedEdge.toString();
	objEdge.from = nodeId;
	objEdge.to = data.id;
	objEdge.label = "";
	objEdge.qualitative = "";
	objEdge.quantified = "";
	objEdge.unit = "";
	objEdge.unit2 = "";
	objEdge.unitOfMeasure = "";
	objEdge.unitOfMeasure2 = "";
	objEdge.description = "";
	
	docModel.beginCompoundOperation();
	lstEdges.push({
		id:objEdge.id,
		from:objEdge.from,
		to:objEdge.to,
		label:objEdge.label,
		qualitative:objEdge.qualitative,
		quantified:objEdge.quantified,
		unit:objEdge.unit,
		unit2:objEdge.unit2,
		unitOfMeasure:objEdge.unitOfMeasure,
		unitOfMeasure2:objEdge.unitOfMeasure2,
		description:objEdge.description
	});
	docModel.endCompoundOperation();
	docModel.endCompoundOperation();
}

// Edits edge on collaborative document
function saveEditEdgeData(data, callback) {

	var doesEdgeExist = edges.get(edgeId);
	
	if(doesEdgeExist != null) {

			document.getElementById(edgeLabelName).id = "edge-label";
			document.getElementById(qualitativeName).id = "edge-qualitative";
			document.getElementById(quantifiedName).id = "edge-quantified";
			document.getElementById(unitName).id = "edge-unit";
			document.getElementById(unit2Name).id = "edge-unit2";	
			document.getElementById(unitOfMeasureName).id = "edge-unitOfMeasure";
			document.getElementById(unitOfMeasure2Name).id = "edge-unitOfMeasure2";
			document.getElementById(edgeDescriptionName).id = "edge-description";
			
			clearEdgePopUp();
			callback(null);
			
			afterSideDisplayEdgeInfo(data);
		}
	}
	else {
		alert("Relationship doesn't exist");
		clearEdgePopUp();
	}
}

function syncUnitOfMeasure() {
	console.log("syncing unit of measure");
	
	var selectedIndex = document.getElementById(quantifiedName).selectedIndex;
	
	if(selectedIndex == 0) {
		document.getElementById(unitOfMeasureName).value = "";
		
		document.getElementById(unitName).value = "";
		document.getElementById(unit2Name).value = "";
		document.getElementById(unitName).disabled = true;
		document.getElementById(unitOfMeasureName).disabled = true;
		document.getElementById(unit2Name).disabled = true;
		document.getElementById(unitOfMeasure2Name).disabled = true;
		
		document.getElementById(unitOfMeasureName).options[0].disabled = false;
		document.getElementById(unitOfMeasureName).options[1].disabled = false;
		
		onEdgeUnitOfMeasureInputChange();
		onEdgeUnitInputChange();
		onEdgeUnit2InputChange();
	}
	if(selectedIndex == 1) {
		document.getElementById(unitOfMeasureName).value = "Dollar(s)";
		
		document.getElementById(unitName).disabled = false;
		document.getElementById(unitOfMeasureName).disabled = true;
		document.getElementById(unit2Name).disabled = false;
		document.getElementById(unitOfMeasure2Name).disabled = false;
		
		document.getElementById(unitOfMeasureName).options[0].disabled = false;
		document.getElementById(unitOfMeasureName).options[1].disabled = false;
		
		document.getElementById(unitOfMeasure2Name).options[0].disabled = true;
		document.getElementById(unitOfMeasure2Name).options[1].disabled = true;
		
		onEdgeUnitOfMeasureInputChange();
	}
	if(selectedIndex == 2 && document.getElementById(unitOfMeasureName).options[0].disabled == false && document.getElementById(unitOfMeasureName).options[1].disabled == false) {
		document.getElementById(unitOfMeasureName).value = "Number(s)";
		
		document.getElementById(unitName).disabled = false;
		document.getElementById(unitOfMeasureName).disabled = false;
		document.getElementById(unit2Name).disabled = false;
		document.getElementById(unitOfMeasure2Name).disabled = false;
		
		document.getElementById(unitOfMeasureName).options[0].disabled = true;
		document.getElementById(unitOfMeasureName).options[1].disabled = true;
		
		onEdgeUnitOfMeasureInputChange();
	}
}
	
function formatDollar() {
	console.log("in format dollar...");
	
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});

	if(document.getElementById(this.quantifiedName).value == "Cost") {
		console.log("formatting currency");
		
		var amount = document.getElementById(this.unitName).value;
		var newAmount;
		
		if(amount.charAt(0) != "$") {
			newAmount = amount;
		}
		else {
			newAmount = amount.slice(1, amount.length);
		}
		console.log(newAmount);
		if(!isNaN(newAmount) && newAmount > 0) {
			
			var whatIsThis = document.getElementById(this.unitName).value = formatter.format(newAmount);
			
			onEdgeUnitInputChange();
		}
		else {
			alert("Enter a positive dollar amount");
			
			document.getElementById(this.unitName).value = "";
			document.getElementById(this.unitName).focus();
		}
	}
}

function clearCreatePopUp() {
	newButton.disabled = false;
	renameButton.disabled = false;
	loadButton.disabled = false;
	document.getElementById('formBackground').style.display = 'none';
	document.getElementById('saveCreateButton').onclick = null;
	document.getElementById('cancelCreateButton').onclick = null;
	document.getElementById('create-popUp').style.display = 'none';
}

function clearNodePopUp() {
	document.getElementById('saveNodeButton').onclick = null;
	document.getElementById('cancelNodeButton').onclick = null;
	document.getElementById('network-NodepopUp').style.display = 'none';
	clearCreatePopUp();
}

function clearEdgePopUp() {
	document.getElementById('saveEdgeButton').onclick = null;
	//document.getElementById('cancelEdgeButton').onclick = null;
	document.getElementById('network-EdgepopUp').style.display = 'none';
	clearCreatePopUp();
}

function cancelNodeEdit(callback) {
	document.getElementById(categoryName).id = "node-category";
	document.getElementById(userInfoName).id = "node-userInfo";
	document.getElementById(labelName).id = "node-label";
	document.getElementById(urlName).id = "node-url";
	document.getElementById(descriptionName).id = "node-description";	
	document.getElementById(locationName).id = "node-location";
	document.getElementById(userName).id = "node-userName";
	document.getElementById(userEmailName).id = "node-userEmail";
	
	clearNodePopUp();
	callback(null);
}

function cancelEdgeEdit(callback) {
	document.getElementById(edgeLabelName).id = "edge-label";
	document.getElementById(qualitativeName).id = "edge-qualitative";
	document.getElementById(quantifiedName).id = "edge-quantified";
	document.getElementById(unitName).id = "edge-unit";
	document.getElementById(unit2Name).id = "edge-unit2";	
	document.getElementById(unitOfMeasureName).id = "edge-unitOfMeasure";
	document.getElementById(unitOfMeasure2Name).id = "edge-unitOfMeasure2";
	document.getElementById(edgeDescriptionName).id = "edge-description";
	
	clearEdgePopUp();
	callback(null);
}