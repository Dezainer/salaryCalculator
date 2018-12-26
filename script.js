const IGMPFONT = 'http://www.portalbrasil.net/igpm.htm'
const INPCFONT = 'http://www.portalbrasil.net/inpc.htm'

const oldSalaryInput = document.getElementById('old-salary')

const newSalaryOutput = document.getElementById('new-salary')
const igmpOutput = document.getElementById('igmp')
const inpcOutput = document.getElementById('inpc')
const adjustmentOutput = document.getElementById('adjustment')

const button = document.getElementsByTagName('BUTTON')[0]
const result = document.getElementsByClassName('result')[0]

const getNewSalary = () => {
	let oldSalary = parseFloat(oldSalaryInput.value)
	if(isNaN(oldSalary)) return

	button.disabled = true
	button.innerHTML = 'CARREGANDO'

	fetchHTML(IGMPFONT).then(IGMPHTML => (
		fetchHTML(INPCFONT).then(INPCHTML => {
			let igmp = parseFloat(getIGMPFromHTML(IGMPHTML))
			let inpc = parseFloat(getINPCFromHTML(INPCHTML))
			let adjustment = calculateAdjustment(igmp, inpc)
			let newSalary = calculateNewSalary(oldSalary,adjustment)

			igmpOutput.innerHTML = igmp
			inpcOutput.innerHTML = inpc
			adjustmentOutput.innerHTML = adjustment.toFixed(4)
			newSalaryOutput.innerHTML = newSalary.toFixed(2)

			result.classList.add('active')

			button.disabled = false
			button.innerHTML = 'CALCULAR'
		})
	))
}

const calculateNewSalary = (oldSalary, adjustment) => (
	oldSalary + (oldSalary * (adjustment / 100))
)

const calculateAdjustment = (igmp, inpc) => (
	(igmp + inpc) / 2
)

const getIGMPFromHTML = html => (
	html.getElementsByTagName('TABLE')[1]
		.children[0]
		.children[0]
		.children[0]
		.children[1]
		.children[0]
		.children[0]
		.children[1]
		.children[3]
		.children[0]
		.children[0]
		.children[0]
		.innerHTML
		.trim()
		.replace(',', '.')
)

const getINPCFromHTML = html => (
	html.getElementsByTagName('TABLE')[3]
		.children[0]
		.children[0]
		.children[0]
		.children[0]
		.children[0]
		.children[0]
		.children[1]
		.children[3]
		.children[0]
		.children[0]
		.innerHTML
		.trim()
		.replace(',', '.')
)


const fetchHTML = url => (
	fetch(url)
		.then(res => res.text())
		.then(text => new DOMParser().parseFromString(text, 'text/html'))
)