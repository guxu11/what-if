import { useState } from 'react';
import { createCustomScenario } from '../utils/glm';

export function CustomScenarioModal({ isOpen, onClose, onCreateScenario }) {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const customScenario = createCustomScenario(title, question, [option1, option2, option3]);
    onCreateScenario(customScenario);
    onClose();
    // Reset form
    setTitle('');
    setQuestion('');
    setOption1('');
    setOption2('');
    setOption3('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>🎨 Create Your Scenario</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="generic-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="generic-title">Scenario Title</label>
            <input
              type="text"
              id="generic-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Big Decision"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="generic-question">What crossroads are you facing?</label>
            <textarea
              id="generic-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe your situation in detail..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="generic-option1">Option A</label>
            <input
              type="text"
              id="generic-option1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="First choice"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="generic-option2">Option B</label>
            <input
              type="text"
              id="generic-option2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="Second choice"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="generic-option3">Option C (optional - creative path)</label>
            <input
              type="text"
              id="generic-option3"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              placeholder="Third choice"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            ✨ Create Scenario
          </button>
        </form>
      </div>
    </div>
  );
}
