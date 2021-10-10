
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


controls = new THREE.OrbitControls( camera, renderer.domElement );
//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;
// instantiate a loader
// var loader = new THREE.OBJLoader();
// let points = []

// // load a resource
// loader.load(
// 	// resource URL
// 	'hand.obj',
// 	// called when resource is loaded
// 	function ( object ) {

// 		scene.add( object );

// 		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// 		object.material = material;
// 		// let positions = object.children[0].geometry.attributes.position;
		
// 		// for(let i=0 ; i<positions.length ; i+=3) {
// 		// 	points.push(new THREE.Vector3(positions[i], positions[i+1], positions[i+2]))
// 		// }
// 		// points.sort((a, b)=> a.z - b.z);


// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );

// var geometry = new THREE.BoxGeometry( 10, 10, 10 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


function getSegmentPlaneIntersection(pointA, pointB, planeZ, intersections) {
	let za = pointA.y - planeZ;
	let zb = pointB.y - planeZ;
	
	if(za * zb > 0) {
		return null
	}

	let t = za / (za - zb)
	let result = pointA.clone().add(pointB.clone().sub(pointA).multiplyScalar(t))
	intersections.push(result)
}

function getTrianglePlaneIntersections(pointA, pointB, pointC, planeZ, intersections) {
	getSegmentPlaneIntersection(pointA, pointB, planeZ, intersections)
	getSegmentPlaneIntersection(pointB, pointC, planeZ, intersections)
	getSegmentPlaneIntersection(pointC, pointA, planeZ, intersections)
}

var sphereGeometry = new THREE.SphereGeometry( 0.2, 32, 32 );
var sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 0.5} );

function createDrop(position) {	
	var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	sphere.position.x = position.x
	sphere.position.y = position.y
	sphere.position.z = position.z
	scene.add( sphere );
	return sphere;
}
// function search() {

// 	let maxIndex = array.length - 1
// 	let minIndex = 0
// 	let i = (maxIndex - minIndex) / 2
	
// 	while( array[i] != value ) {
// 		if(array[i] > value) {
// 			minIndex = i
// 		} else if(array[i] < value) {
// 			maxIndex = i
// 		}
// 		i = (maxIndex - minIndex) / 2
// 	}
// }

// instantiate the loader
var loader = new THREE.OBJLoader2();
var lineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
var lineGeometry = new THREE.Geometry();

var cylinderGeometry = new THREE.CylinderGeometry( 0.1, 0.1, 20, 32 );
var cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0x128999} );
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial );
cylinder.position.y = 30
scene.add( cylinder );

var faceGeometry = new THREE.Geometry();

function vectorsAreEqual(v1, v2) {
	return v1.distanceTo(v2) < 0.0001;
}
let loops = []
let targets = []
let drops = []
// function called on successful load
var callbackOnLoad = function ( event ) {
	var material = new THREE.MeshBasicMaterial( { color: 0x2194ce, wireframe: true } );
	let hand = event.detail.loaderRootNode.children[0]
	hand.material = material;


	let positions = hand.geometry.attributes.position;
	
	let points = []
	let maxHeight = -Number.MAX_VALUE;
	for(let i=0 ; i<positions.count*3 ; i+=3) {
		let v = new THREE.Vector3(positions.array[i], positions.array[i+1], positions.array[i+2])
		points.push(v)
		if(v.y > maxHeight) {
			maxHeight = v.y
		}
	}

	// let color = new THREE.Color( 0xffffff );
	// let materials = []
	// for(let i=0 ; i<20 ; i++) {

 //        color.setHex( Math.random() * 0xffffff );
 //        var faceMaterial = new THREE.MeshBasicMaterial( { color : color.getHex(), wireframe: true  } );
 //        materials.push(faceMaterial);
		
	// }
	
	// for(let i=0 ; i<points.length-3 ; i+=3) {
	// 	faceGeometry.vertices.push( points[i] );
	// 	faceGeometry.vertices.push( points[i+1] );
	// 	faceGeometry.vertices.push( points[i+2] );
	// 	// var face = new THREE.Face3(i, i+1, i+2, null, null, Math.floor(20*Math.random()));
	// 	let color = new THREE.Color( 0xffffff );
	// 	color.setHex( Math.random() * 0xffffff );
	// 	// var face = new THREE.Face3(i, i+1, i+2, null, color);//, Math.floor(20*Math.random()));
	// 	var face = new THREE.Face3(i, i+1, i+2, null, null, Math.floor(15*Math.random()));
	// 	faceGeometry.faces.push( face );
	// }

	// // material.color.setHex( Math.random() * 0xffffff );

	// var faceMaterial = new THREE.MeshBasicMaterial( { color : color.getHex(), wireframe: true  } );
	// let faceMesh = new THREE.Mesh( faceGeometry, materials );
	// faceMesh.position.x += 10;
	// scene.add( faceMesh );
	// scene.add( new THREE.Mesh( faceGeometry ) );

	// points.sort((a, b)=> a.z - b.z);

	// scene.add( event.detail.loaderRootNode );

	
	let nPlanes = 20

	for(let n=0 ; n<nPlanes ; n++) {
		let z = ((n+0.5) / nPlanes) * maxHeight;
		let intersections = []
		for(let i=0 ; i<points.length-3 ; i+=3) {
			let segment = []
			getTrianglePlaneIntersections(points[i], points[i+1], points[i+2], z, segment)
			
			if(segment.length >= 2) {
				intersections.push(segment)
				// lineGeometry.vertices.push(segment[0]);
				// lineGeometry.vertices.push(segment[1]);
			}
		}

		while(intersections.length > 0) {
			let loop = []
			loops.push(loop)
			let segment = intersections.pop()
			let firstVertex = segment[0];
			loop.push(firstVertex)
			let currentVertex = segment[1];
			while(!vectorsAreEqual(currentVertex, firstVertex)) {

				for(let i=0 ; i<intersections.length ; i++) {
					let intersection = intersections[i]
					if(vectorsAreEqual(intersection[0], currentVertex)) {
						currentVertex = intersection[1]
						loop.push(currentVertex)
						intersections.splice(i, 1)
						break
					} else if(vectorsAreEqual(intersection[1], currentVertex)) {
						currentVertex = intersection[0]
						loop.push(currentVertex)
						intersections.splice(i, 1)
						break
					}
				}
			}

			for(let v of loop) {
				lineGeometry.vertices.push(v);	
			}
		}

	}
	let dropDistance = 0.3
	let distance = 0
	let currentVertex = loops[0][0]
	currentTargetIndex = 0

	for(let loop of loops) {
		let n=0
		for(let v of loop) {
			distance += v.distanceTo(currentVertex)
			currentVertex = v
			if(n%2==0) {
				// createDrop(v)
				targets.push(v)
			}
			n++
		}
		// let distance = 0
		// let remainingDistance = dropDistance
		// let segmentDistance = 0
		// let currentPosition = loop[0].clone()
		// for(let i=1 ; i<loop.length ; i++) {
		// 	let delta = loop[i].clone().sub(loop[i-1])
		// 	currentPosition = loop[i].clone()
		// 	let segmentLength = delta.length()
		// 	let direction = delta.normalize()
		// 	segmentDistance += segmentLength
		// 	while(distance < segmentDistance) {
		// 		currentPosition.add(direction.multiplyScalar(remainingDistance))
		// 		remainingDistance = dropDistance
		// 		createDrop(currentPosition)
		// 		distance += dropDistance
		// 	}
		// 	remainingDistance -= segmentDistance - distance
		// }
	}

	console.log(distance)

	// var line = new THREE.LineSegments( lineGeometry, lineMaterial );
	var line = new THREE.Line( lineGeometry, lineMaterial );
	// scene.add( line );

};

// load a resource from provided URL synchronously
loader.load( 'hand.obj', callbackOnLoad, null, null, null, false );


camera.position.z = 30;

let currentTargetIndex = null
let headSpeed = 20
let dropSpeed = 0.5
let offsetY = 10
let previousUpdate = Date.now()

var animate = function (timestamp) {
	requestAnimationFrame( animate );

	controls.update();

	let deltaT = (timestamp - previousUpdate) / 1000
	previousUpdate = timestamp
	
	if(currentTargetIndex != null && currentTargetIndex < targets.length) {
		let currentTarget = targets[currentTargetIndex].clone()
		currentTarget.y = 30
		let delta = currentTarget.clone().sub(cylinder.position)
		let length = delta.length()
		delta.normalize()
		if(length > headSpeed * deltaT) {
			delta.multiplyScalar(headSpeed * deltaT)
			cylinder.position.x += delta.x
			cylinder.position.z += delta.z
		} else {
			currentTargetIndex++
			cylinder.position.x = currentTarget.x
			cylinder.position.z = currentTarget.z
			currentTarget.y = 20
			drops.push(createDrop(currentTarget))
		}
		
	}

	for(let drop of drops) {
		drop.position.y -= dropSpeed * deltaT
	}

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();