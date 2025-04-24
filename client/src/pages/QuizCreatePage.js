import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const QuizCreatePage = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      timeLimit: 30,
      isPublished: false,
      questions: [
        {
          questionText: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          points: 1
        }
      ]
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string(),
      timeLimit: Yup.number().min(1).required('Required'),
      questions: Yup.array().of(
        Yup.object().shape({
          questionText: Yup.string().required('Question text is required'),
          options: Yup.array().of(
            Yup.object().shape({
              text: Yup.string().required('Option text is required'),
              isCorrect: Yup.boolean()
            })
          ).min(2, 'At least 2 options required'),
          points: Yup.number().min(1).required('Points required')
        })
      ).min(1, 'At least one question is required')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const res = await axios.post('/api/quizzes', values);
        history.push(`/quiz/${res.data._id}`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const addQuestion = () => {
    formik.setFieldValue('questions', [
      ...formik.values.questions,
      {
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        points: 1
      }
    ]);
  };

  const removeQuestion = (index) => {
    const questions = [...formik.values.questions];
    questions.splice(index, 1);
    formik.setFieldValue('questions', questions);
  };

  const addOption = (questionIndex) => {
    const questions = [...formik.values.questions];
    questions[questionIndex].options.push({ text: '', isCorrect: false });
    formik.setFieldValue('questions', questions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const questions = [...formik.values.questions];
    questions[questionIndex].options.splice(optionIndex, 1);
    formik.setFieldValue('questions', questions);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Create New Quiz</Typography>
      <Paper style={{ padding: '2rem' }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Quiz Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="timeLimit"
                name="timeLimit"
                label="Time Limit (minutes)"
                type="number"
                value={formik.values.timeLimit}
                onChange={formik.handleChange}
                error={formik.touched.timeLimit && Boolean(formik.errors.timeLimit)}
                helperText={formik.touched.timeLimit && formik.errors.timeLimit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isPublished}
                    onChange={formik.handleChange}
                    name="isPublished"
                    color="primary"
                  />
                }
                label="Publish immediately"
              />
            </Grid>
            
            {formik.values.questions.map((question, qIndex) => (
              <React.Fragment key={qIndex}>
                <Grid item xs={12}>
                  <Divider style={{ margin: '1rem 0' }} />
                  <Typography variant="h6">Question {qIndex + 1}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name={`questions[${qIndex}].questionText`}
                    label="Question Text"
                    value={question.questionText}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.questions?.[qIndex]?.questionText && 
                      Boolean(formik.errors.questions?.[qIndex]?.questionText)
                    }
                    helperText={
                      formik.touched.questions?.[qIndex]?.questionText && 
                      formik.errors.questions?.[qIndex]?.questionText
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name={`questions[${qIndex}].points`}
                    label="Points"
                    type="number"
                    value={question.points}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.questions?.[qIndex]?.points && 
                      Boolean(formik.errors.questions?.[qIndex]?.points)
                    }
                    helperText={
                      formik.touched.questions?.[qIndex]?.points && 
                      formik.errors.questions?.[qIndex]?.points
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Options</Typography>
                  {question.options.map((option, oIndex) => (
                    <Grid container spacing={2} alignItems="center" key={oIndex}>
                      <Grid item xs={1}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const questions = [...formik.values.questions];
                                questions[qIndex].options[oIndex].isCorrect = e.target.checked;
                                formik.setFieldValue('questions', questions);
                              }}
                              name={`questions[${qIndex}].options[${oIndex}].isCorrect`}
                              color="primary"
                            />
                          }
                          label="Correct"
                        />
                      </Grid>
                      <Grid item xs={9}>
                        <TextField
                          fullWidth
                          name={`questions[${qIndex}].options[${oIndex}].text`}
                          label={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.questions?.[qIndex]?.options?.[oIndex]?.text && 
                            Boolean(formik.errors.questions?.[qIndex]?.options?.[oIndex]?.text)
                          }
                          helperText={
                            formik.touched.questions?.[qIndex]?.options?.[oIndex]?.text && 
                            formik.errors.questions?.[qIndex]?.options?.[oIndex]?.text
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton 
                          onClick={() => removeOption(qIndex, oIndex)}
                          disabled={question.options.length <= 2}
                        >
                          <RemoveIcon />
                        </IconButton>
                        {oIndex === question.options.length - 1 && (
                          <IconButton onClick={() => addOption(qIndex)}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={formik.values.questions.length <= 1}
                  >
                    Remove Question
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={addQuestion}
                startIcon={<AddIcon />}
              >
                Add Question
              </Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Quiz'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default QuizCreatePage;
