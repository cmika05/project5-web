import logo from './logo.svg';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './App.css';
import { DatePicker, Button } from 'antd';
import {useEffect, useState} from 'react'
import { Modal, Collapse } from 'antd';
const { Panel } = Collapse;



function App() {

    const [categories, setCategories] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [questions, setQuestions] = useState('');

    const [answers, setAnswers] = useState({});

    const [showQuestionForm, setShowQuestionForm] = useState(false);

    const [showAnswerForm, setShowAnswerForm] = useState(false);

    const [questionTxt, setQuestionTxt] = useState('');
    const [AnswerTxt, setAnswerTxt] = useState('');

    const fetchCategories = async () => {
        let res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories`)
        let json = await res.json()
        console.log(json)
        setCategories(json)
    };

    useEffect(() => {
        console.log('run this only once when the page loads up')
        fetchCategories()
    }, [])

    const fetchQuestions = async (category) => {
      
        let res = await fetch(`${process.env.REACT_APP_API_URL}/v1/categories/${category.id}/questions`)
        let data = await res.json()
        console.log(data)
        setQuestions(data)
      
    };

    const switchCategory = async (category) => {
        console.log('the selcted category is', category)
        setSelectedCategory(category)

         // write code here to fetch the questions for the selected category
         fetchQuestions(category)
        };
    
        const createQuestion = async () => {
            console.log('questionTxt', questionTxt)
            console.log('selectedCategory', selectedCategory)
            let res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories/${selectedCategory.id}/questions`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({questionTxt: questionTxt})
              
              });
            //let data = await res.json()
            //console.log(data)
            console.log(2)
            fetchQuestions(selectedCategory)
            setQuestionTxt('')
            setShowQuestionForm(false)
        };
         
      
           const fetchAnswersForQuestion = async (q) => {
            console.log('fetch the answers for the question ', q)
            console.log(`${process.env.REACT_APP_API_URL}/api/v1/questions/${q.id}/answers`)
            let res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/questions/${q.id}/answers`)
            let data = await res.json()
            console.log(data)
    
            // Google for: update an array of objects using react hooks
            setAnswers({...answers, [q.id]: data})
    
        };
    
        const onPanelChange = async (questionId) => {
            console.log(questionId)
            let q
            questions.map((question) => {
                if(question.id == questionId){
                    q = question
                }
            })
            console.log(q)
            setSelectedQuestion(q)
            fetchAnswersForQuestion(q)
            console.log('panel was clicked')
    
        };
    
       return (
        <>


<div className={'flex justify-center p-6 font-bold text-4xl border bg-blue-900 underline'}>
            <h1>CAPSTONE APP</h1>

        </div>

        <Modal title="New Question" visible={showQuestionForm} closable={false} footer={null}>
            {selectedCategory && <div className={'w-full p-3'}>
                    <textarea value={questionTxt}
                              onChange={(ev) => setQuestionTxt(ev.currentTarget.value)}
                              type="text"
                              rows={4}
                              className={'border p-1 w-full mb-4'}
                              placeholder={'Enter the question...'}/>

                <button className={'p-2 bg-green-800 text-white uppercase font-bold rounded mr-4'} onClick={createQuestion}>Create Question</button>
                <button className={'p-2 bg-red-800 text-white uppercase font-bold rounded'} onClick={() => setShowQuestionForm(false)}>Cancel</button>
            </div>}

            </Modal>

          
            <Modal title="New answers" visible={showQuestionForm} closable={false} footer={null}>
            {selectedCategory && <div className={'w-full p-3'}>
                    <textarea value={questionTxt}
                              onChange={(ev) => setQuestionTxt(ev.currentTarget.value)}
                              type="text"
                              rows={4}
                              className={'border p-1 w-full mb-4'}
                              placeholder={'Enter the answer...'}/>

                <button className={'p-2 bg-green-800 text-white uppercase font-bold rounded mr-4'} onClick={createQuestion}>Create answers</button>
                <button className={'p-2 bg-red-800 text-white uppercase font-bold rounded'} onClick={() => setShowQuestionForm(false)}>Cancel</button>
            </div>}

            </Modal>

<div className={'grid grid-cols-12'}>
    <div className={'col-span-12 md:col-span-2 font-bold text-2xl bg-red-200'}>
        {/*<h1>Category Listing</h1>*/}


        <ul className={'border'}>
            {categories && categories.map((category) => {
                return <li key={category.id}
                           onClick={() => switchCategory(category)}
                           className={(selectedCategory && (selectedCategory.id == category.id)) ?  'p-15 border-b text-4xl bg-red-400 cursor-pointer' : 'cursor-pointer p-15 border-b text-4xl'}>{category.name}</li>
            })}
        </ul>
    </div>

    <div className={'col-span-12 border md:col-span-10 font-bold text-2xl bg-gray-400 h-96'}>
    {selectedCategory && <div className={'p-4'}>
                    <button className={'col-span-12 rounded md:col-span-10 bg-red-600 mr-4 py-1 px-1 uppercase font-bold'} onClick={() => setShowQuestionForm(true)}>New Question</button>
                    <button className={'col-span-12 rounded md:col-span-10 bg-green-600 py-1 px-1 uppercase font-bold'} onClick={() => setShowQuestionForm(true)}>New Answer</button>
                </div>}




                {selectedCategory ? <h1 className={'font-bold text-center uppercase underline text-3xl text-gray-900'}>Questions</h1> : <h1 className={'font-bold text-center text-3xl text-gray-900 mt-20 uppercase'}>Select a Category to continue</h1>}


                {selectedCategory && questions && questions.length>0 && <div className={'flex justify-center px-24 w-full'}>
                    <Collapse accordion className={'w-full'} onChange={(onPanelChange)} >
                        {questions && questions.map((question , index) => {
                            return <Panel header={question.questionTxt} key={question.id}>

                                <ul>
                                    { answers && answers[question.id] && answers[question.id].map((answer) => {
                                        return <li key={answer.id}>{answer.answerTxt}</li>
                                    })}
                                </ul>

                                <button className={'p-2 bg-red-800 text-white uppercase font-bold rounded text-center'}>New Answer</button>


                            </Panel>
                        })}
                    </Collapse>
                </div>}

                </div>

</div>



</>
);
}
export default App;